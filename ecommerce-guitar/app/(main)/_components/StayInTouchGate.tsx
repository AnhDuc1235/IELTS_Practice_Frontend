"use client";

import { usePathname } from "next/navigation";
import StayInTouch from "./stay-touch";

export default function StayInTouchGate() {
  const pathname = usePathname();
  if (pathname === "/checkout/payment") {
    return null;
  }

  return (
    <div className="bg-[#eeeeee]">
      <StayInTouch />
    </div>
  );
}
