import { DEFAULT_IMG_RESIZE_OPTIONS } from "@/domain/Gig/constants";
import { invalidImageUrlError } from "@/domain/Gig/errors";
import cloudinaryV2 from "@/lib/cloudinary";
import { Gig } from "@prisma/client";
import { UploadApiOptions } from "cloudinary";
import imageType from "image-type";
import sharp, { AvailableFormatInfo, FormatEnum, ResizeOptions } from "sharp";

const GIG_POSTERS_FOLDER_NAME = "gigs-poster";

// Vercel blob storage is not used anymore because of it's bandwidth limit

// import { put as blobPut } from "@vercel/blob";

// export async function downloadAndStoreImageToVercel({
//   filename,
//   imageFormat,
//   imageUrl,
//   resizeOptions,
// }: {
//   filename: string;
//   imageFormat: keyof FormatEnum | AvailableFormatInfo;
//   imageUrl: string;
//   resizeOptions?: ResizeOptions;
// }): Promise<string> {
//   // Download image and store it in blob storage
//   const response = await fetch(imageUrl);
//   const arrayBufferImg = await (await response.blob()).arrayBuffer();
//   const bufferImg = Buffer.from(arrayBufferImg);
//   const resizedImg = await sharp(bufferImg)
//     .resize(resizeOptions)
//     .toFormat(imageFormat)
//     .toBuffer();
//   const { url } = await blobPut(filename + ".jpg", new Blob([resizedImg]), {
//     access: "public",
//   });
//   return url;
// }

export async function downloadImage(imageUrl: string): Promise<ArrayBuffer> {
  const response = await fetch(imageUrl);
  const arrayBufferImg = await (await response.blob()).arrayBuffer();
  return arrayBufferImg;
}

/**
 * Download a remote image and upload it to Cloudinary and override the previous image if any
 */
export async function storeImage({
  arrayBufferImg,
  filename,
  imageFormat,
  resizeOptions = DEFAULT_IMG_RESIZE_OPTIONS,
}: {
  arrayBufferImg: ArrayBuffer;
  filename: string;
  imageFormat: keyof FormatEnum | AvailableFormatInfo;
  resizeOptions?: ResizeOptions;
}): Promise<string> {
  const type = await imageType(arrayBufferImg);
  if (!type) {
    throw invalidImageUrlError;
  }
  const resizedImg = await sharp(arrayBufferImg)
    .resize(resizeOptions)
    .toFormat(imageFormat)
    .toBuffer();

  // Workaround using base64, see : https://community.cloudinary.com/discussion/439/405-cloudinary-only-on-production-using-vercel-nextjs
  const base64Data = resizedImg.toString("base64");
  const fileUri = `data:image/jpeg;base64,${base64Data}`;

  const cloudinaryImageUrl = await storeImageToCloudinary(filename, fileUri);
  return cloudinaryImageUrl;
}

export async function storeImageToCloudinary(
  filename: string,
  fileUri: string,
): Promise<string> {
  const options: UploadApiOptions = {
    unique_filename: false,
    overwrite: true,
    discard_original_filename: true,
    display_name: filename,
    public_id: filename,
    folder: GIG_POSTERS_FOLDER_NAME,
  };

  // eslint-disable-next-line no-console
  console.log("Uploading image to Cloudinary...");
  const result = await cloudinaryV2.uploader.upload(fileUri, options);
  const cloudinaryImageUrl = result.secure_url;
  return cloudinaryImageUrl;
}

export async function deleteGigImage(imageUrl: Gig["imageUrl"]) {
  if (imageUrl) {
    const publicId = getGigImagePublicId(imageUrl);
    // eslint-disable-next-line no-console
    console.log("Trying to delete image with public id '" + publicId + "'.");
    const result = await cloudinaryV2.uploader.destroy(
      getGigImagePublicId(imageUrl),
    );
    // eslint-disable-next-line no-console
    console.log(result);
  }
}

export function getGigImagePublicId(imageUrl: string) {
  const splittedUrl = imageUrl.split("/");
  const imagePublicId = splittedUrl[splittedUrl.length - 1].replace(".jpg", "");
  return GIG_POSTERS_FOLDER_NAME + "/" + imagePublicId;
}
