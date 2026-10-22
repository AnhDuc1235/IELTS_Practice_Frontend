"use client";

import * as React from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 350);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      className="fixed right-4 bottom-4 z-[120] flex h-11 w-11 cursor-pointer items-center justify-center bg-[rgb(187,155,105)] text-black"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}

