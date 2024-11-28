import { getImageUrl } from "@/utils/image";
import { Image, ImageProps } from "@mantine/core";

// See getImageUrl() comment to understand why this component exists
export default function OptimizedImage(
  imageProps: ImageProps & { alt: string },
) {
  const { src } = imageProps;

  return <Image {...imageProps} alt={imageProps.alt} src={getImageUrl(src)} />;
}
