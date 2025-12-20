import { DEFAULT_IMG_RESIZE_OPTIONS } from "@/domain/Gig/constants";
import { invalidImageUrlError, tooBigImageUrlError } from "@/domain/Gig/errors";
import { MAX_IMAGE_SIZE } from "@/domain/image";
import cloudinaryV2 from "@/lib/cloudinary";
import { Gig } from "@prisma/client";
import { UploadApiOptions } from "cloudinary";
import imageType from "image-type";
import sharp, { AvailableFormatInfo, FormatEnum, ResizeOptions } from "sharp";

const GIG_POSTERS_FOLDER_NAME = "gigs-poster";

export async function downloadImage(imageUrl: string): Promise<ArrayBuffer> {
  const url = new URL(imageUrl);
  const invalidProtocol = !["http:", "https:"].includes(url.protocol);
  const invalidDomain =
    url.hostname === "localhost" || url.hostname.endsWith(".local");

  if (invalidProtocol || invalidDomain) {
    throw new Error(invalidImageUrlError.name);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  const response = await fetch(url.toString(), {
    redirect: "error",
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.startsWith("image/")) {
    throw new Error("Not an image");
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_IMAGE_SIZE) {
    throw new Error(tooBigImageUrlError.name);
  }

  return await response.arrayBuffer();
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
    // eslint-disable-next-line @typescript-eslint/only-throw-error
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

  console.log("Uploading image to Cloudinary...");
  const result = await cloudinaryV2.uploader.upload(fileUri, options);
  const cloudinaryImageUrl = result.secure_url;
  return cloudinaryImageUrl;
}

export async function deleteGigImage(imageUrl: Gig["imageUrl"]) {
  if (imageUrl) {
    const publicId = getGigImagePublicId(imageUrl);

    console.log("Trying to delete image with public id '" + publicId + "'.");
    const result: unknown = await cloudinaryV2.uploader.destroy(
      getGigImagePublicId(imageUrl),
    );

    console.log(result);
  }
}

export function getGigImagePublicId(imageUrl: string) {
  const splittedUrl = imageUrl.split("/");
  const imagePublicId = splittedUrl[splittedUrl.length - 1].replace(".jpg", "");
  return GIG_POSTERS_FOLDER_NAME + "/" + imagePublicId;
}
