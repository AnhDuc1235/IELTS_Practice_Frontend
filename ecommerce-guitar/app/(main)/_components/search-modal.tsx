"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type Option = {
  id: string;
  label: string;
};

const options: Option[] = [
  { id: "guitar", label: "Guitar Store" },
  { id: "accessories", label: "Accessories" },
  { id: "blog", label: "Blog" },
];

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [active, setActive] = React.useState<string>("guitar");

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    setValue("");
    setActive("guitar");
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (active === "blog") {
      onClose();
      return;
    }

    const params = new URLSearchParams();
    const keyword = value.trim();

    if (keyword) {
      params.set("search", keyword);
    }

    params.set("scope", active === "accessories" ? "accessories" : "store");
    onClose();
    router.push(`/guitar-store?${params.toString()}`);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-[80]"
        onClick={onClose}
        aria-hidden
      />

      <div className="fixed inset-x-0 top-[220px] z-[90] px-3">
        <div className="mx-auto max-w-[520px] border border-[#cfcfcf] bg-white text-black shadow-2xl">
          <div className="flex items-center gap-0 p-4">
            <div className="flex-1">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search"
                className="w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
              />
            </div>
            <button
              type="button"
              className="bg-white border border-[#cfcfcf] border-l-0 px-4 py-2 text-[14px] font-semibold"
              onClick={handleSubmit}
            >
              Search
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-5">
              {options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="flex items-center gap-2 text-[13px]"
                  onClick={() => setActive(o.id)}
                >
                  <span
                    className={[
                      "inline-block h-3.5 w-3.5 rounded-full border",
                      active === o.id
                        ? "border-black bg-black"
                        : "border-black/30 bg-white",
                    ].join(" ")}
                  />
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

