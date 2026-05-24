"use client";

import clsx from "clsx";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";

interface ImageProps extends NextImageProps {
  rounded?: string;
}

const Image = (props: ImageProps) => {
  const { alt, src, className, rounded, ...rest } = props;
  const [isLoading, setLoading] = useState(true);

  // Normalize image source to prevent Next.js image parsing errors
  let validSrc = src;
  const DEFAULT_AVATAR = "https://i.pinimg.com/736x/87/84/f1/8784f1837e28bbaefae93c7d63259160.jpg";
  if (typeof src === "string") {
    if (!src) {
      validSrc = DEFAULT_AVATAR;
    } else if (
      !src.startsWith("/") &&
      !src.startsWith("http://") &&
      !src.startsWith("https://") &&
      !src.startsWith("data:")
    ) {
      validSrc = `/${src}`;
    }
  } else if (!src) {
    validSrc = DEFAULT_AVATAR;
  }

  return (
    <div
      className={clsx(
        "overflow-hidden",
        isLoading ? "animate-pulse" : "",
        rounded,
        props.fill ? "relative w-full h-full" : "",
      )}
    >
      <NextImage
        className={clsx(
          "duration-700 ease-in-out",
          isLoading
            ? "scale-[1.02] blur-xl grayscale"
            : "scale-100 blur-0 grayscale-0",
          rounded,
          className,
        )}
        src={validSrc}
        alt={alt}
        loading="lazy"
        quality={75}
        unoptimized
        // priority
        onLoad={() => setLoading(false)}
        {...rest}
      />
    </div>
  );
};

export default Image;
