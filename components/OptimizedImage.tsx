"use client";

import NextImage from "next/image";
import { Box, Image } from "@mantine/core";
import { getImageUrl } from "@/utils/image";

interface Props {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  preload?: boolean;
  className?: string;
  sizes?: string; // optional: only used for Next/Image
  style?: React.CSSProperties;
}

/**
 * Hybrid component:
 * - Uses Next/Image if width or height is provided → full Next.js optimization
 * - Falls back to simple <img> if no dimensions → works with SSR, avoids hydration issues
 *
 * Also, it loads a dummy pic when on development, see getImageUrl().
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  preload = false,
  className,
  style,
  sizes,
}: Props) {
  const hasSize = !!width || !!height;

  // Use NextImage when possible for better optimization, otherwise fallback to Mantine Image
  if (hasSize) {
    return (
      <Box
        className={className}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: `${width}/${height}`,
          height,
          ...style,
        }}
      >
        <NextImage
          src={getImageUrl(src)}
          alt={alt}
          fill
          preload={preload}
          style={{ objectFit: "cover" }}
          sizes={sizes ?? "100vw"} // responsive width hint
        />
      </Box>
    );
  }

  // Simple fallback on client side
  return (
    <Box className={className} style={{ width: "100%", ...style }}>
      <Image
        src={getImageUrl(src)}
        alt={alt}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "cover",
        }}
      />
    </Box>
  );
}
