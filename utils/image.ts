import { MAX_IMAGE_SIZE } from "@/domain/image";

/**
 * To avoid using all storage hosting bandwidth in development, picsum images are displayed.
 */
export function getImageUrl(imageUrl: string | undefined) {
  if (!imageUrl) {
    return `/images/fallbackImage.jpg`;
  }
  if (process.env.NODE_ENV === "development") {
    const splittedUrl = imageUrl.split("/");
    const seedUrl = splittedUrl[splittedUrl.length - 1].replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, // remove all special
      "",
    );
    return `https://picsum.photos/seed/${seedUrl}/640/360`;
  }
  return imageUrl;
}

export function validateImageFile(value: File | null | undefined) {
  if (!value) return null;
  const { size, type } = value;
  if (!type.startsWith("image/")) {
    return "Le fichier doit être une image.";
  }
  if (size > MAX_IMAGE_SIZE) {
    return `Le fichier est trop volumineux (taille maximale autorisée : ${(MAX_IMAGE_SIZE / 1000000).toString()} Mo).`;
  }
  return null;
}
