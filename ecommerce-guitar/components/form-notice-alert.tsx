"use client";

import { Check, X } from "lucide-react";

export type FormNoticeTone = "success" | "error";

export function FormNoticeAlert({
  tone,
  message,
  onClose,
}: {
  tone: FormNoticeTone;
  message: string;
  onClose: () => void;
}) {
  const isSuccess = tone === "success";
  const containerClass = isSuccess
    ? "border-[#b9ddba] bg-[#d8efd8] text-[#2f6f39]"
    : "border-[#ebc0c6] bg-[#f6d9de] text-[#8f2f3d]";

  const bodyWithoutPrefix = message.replace(/^\s*Success:\s*/i, "").trim();
  const successRest = bodyWithoutPrefix.length > 0 ? ` ${bodyWithoutPrefix}` : "";

  return (
    <div
      className={`mb-4 flex items-start justify-between gap-3 rounded border px-4 py-3 text-[14px] ${containerClass}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {isSuccess ? (
          <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#2f6f39]">
            <Check className="h-3 w-3 text-white" strokeWidth={3} />
          </span>
        ) : (
          <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#8f2f3d] text-[12px] font-bold leading-none text-white">
            !
          </span>
        )}
        {isSuccess ? (
          <span className="min-w-0 pt-0.5 leading-snug">
            <span className="font-bold">Success:</span>
            {successRest}
          </span>
        ) : (
          <span className="min-w-0 pt-0.5 leading-snug">{message}</span>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="shrink-0 text-current/80 transition-colors hover:text-current"
      >
        <X size={14} />
      </button>
    </div>
  );
}
