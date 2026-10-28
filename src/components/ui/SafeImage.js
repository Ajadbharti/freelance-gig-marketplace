"use client";

import { useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/utils";

export default function SafeImage({ src, alt = "", className, ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const useFallback = !src || failedSrc === src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={useFallback ? FALLBACK_IMAGE : src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailedSrc(src)}
      {...props}
    />
  );
}