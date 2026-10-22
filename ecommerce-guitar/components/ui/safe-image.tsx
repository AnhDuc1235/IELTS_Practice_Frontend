"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;
const OVERLAY_CLASSNAME = "absolute inset-0 h-full w-full";

type SafeImageStatus = "loading" | "loaded" | "error";

type SafeImageProps = ImageProps & {
  fallbackClassName?: string;
};

export default function SafeImage({
  className,
  fallbackClassName,
  fill,
  alt,
  onLoad,
  onError,
  ...rest
}: SafeImageProps) {
  const [status, setStatus] = React.useState<SafeImageStatus>("loading");
  const [retryKey, setRetryKey] = React.useState(0);
  const retryCountRef = React.useRef(0);

  const handleLoad: ImageProps["onLoad"] = (event) => {
    setStatus("loaded");
    onLoad?.(event);
  };

  const handleError: ImageProps["onError"] = (event) => {
    if (retryCountRef.current < MAX_RETRIES) {
      retryCountRef.current += 1;
      setStatus("loading");
      window.setTimeout(() => setRetryKey((current) => current + 1), RETRY_DELAY_MS);
      return;
    }
    setStatus("error");
    onError?.(event);
  };

  if (status === "error") {
    return (
      <div
        aria-hidden
        className={cn(
          OVERLAY_CLASSNAME,
          "flex items-center justify-center bg-[#f1f1f1] text-[#a8a8a8]",
          fallbackClassName,
        )}
      >
        <ImageOff className="h-6 w-6" />
      </div>
    );
  }

  return (
    <>
      {status === "loading" ? (
        <Skeleton
          aria-hidden
          className={cn(OVERLAY_CLASSNAME, "rounded-none bg-[#ececec]")}
        />
      ) : null}
      <Image
        {...rest}
        key={retryKey}
        alt={alt}
        fill={fill}
        className={cn(
          className,
          "transition-opacity duration-300",
          status === "loaded" ? "opacity-100" : "opacity-0",
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
}
