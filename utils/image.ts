/**
 * To avoid using all storage hosting bandwidth in development, picsum images are displayed.
 */
export function getImageUrl(imageUrl?: string | null) {
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
