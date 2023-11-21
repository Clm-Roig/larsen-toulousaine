import cloudinaryV2 from "@/lib/cloudinary";
import { Gig } from "@prisma/client";
import { UploadApiOptions } from "cloudinary";
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

export async function downloadAndStoreImage({
  filename,
  imageFormat,
  imageUrl,
  resizeOptions,
}: {
  filename: string;
  imageFormat: keyof FormatEnum | AvailableFormatInfo;
  imageUrl: string;
  resizeOptions?: ResizeOptions;
}): Promise<string> {
  const response = await fetch(imageUrl);
  const arrayBufferImg = await (await response.blob()).arrayBuffer();
  const bufferImg = Buffer.from(arrayBufferImg);
  const resizedImg = await sharp(bufferImg)
    .resize(resizeOptions)
    .toFormat(imageFormat)
    .toBuffer();

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
  const fileUrl = await new Promise<string>((resolve, reject) => {
    cloudinaryV2.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error(
            "Error when uploading image to Cloudinary: " + error.message,
          );
          return reject(error);
        }
        if (!result?.url) {
          return reject("Cloudinary's stream did not return a file URL.");
        }
        return resolve(result.secure_url);
      })
      .end(resizedImg);
  });
  return fileUrl;
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
