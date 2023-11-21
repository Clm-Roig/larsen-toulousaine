/**
 * Images are stored on a Vercel blob storage which is limited (in hobby plan) to 100Mb of bandwidth.
 * To avoid using these 100Mb, other images are displayed in development.
 */
export function getImageUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) {
    return `https://placehold.co/${640}x${360}?text=.`;
  }
  if (process.env.NODE_ENV === "development") {
    const splittedUrl = imageUrl?.split("/");
    const seedUrl = splittedUrl?.[splittedUrl?.length - 1].replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, // remove all special
      "",
    );
    return `https://picsum.photos/seed/${seedUrl}/${640}/${360}`;
  }
  return imageUrl;
}
