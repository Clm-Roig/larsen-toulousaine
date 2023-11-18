import { getImageUrl } from "@/utils/image";
import { Image, ImageProps } from "@mantine/core";

// See getImageUrl() comment to understand why this component exists
export default function OptimizedImage(
  imageProps: ImageProps & { alt: string },
) {
  const { alt, src } = imageProps;

  return (
    <Image
      {...imageProps}
      src={typeof src === "string" || !src ? getImageUrl(src) : src}
      alt={alt}
    />
  );
}
