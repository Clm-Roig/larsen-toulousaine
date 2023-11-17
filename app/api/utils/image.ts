import { put as blobPut } from "@vercel/blob";
import sharp, { AvailableFormatInfo, FormatEnum, ResizeOptions } from "sharp";

export async function downloadImage({
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
  // Download image and store it in blob storage
  const response = await fetch(imageUrl);
  const arrayBufferImg = await (await response.blob()).arrayBuffer();
  const bufferImg = Buffer.from(arrayBufferImg);
  const resizedImg = await sharp(bufferImg)
    .resize(resizeOptions)
    .toFormat(imageFormat)
    .toBuffer();
  const { url } = await blobPut(filename + ".jpg", new Blob([resizedImg]), {
    access: "public",
  });
  return url;
}
