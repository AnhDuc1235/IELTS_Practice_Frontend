import Image from "next/image";

export default function TryGuitarSection() {
  return (
    <section className="border-y border-[#d9d9d9] bg-white py-8">
      <div className="mx-auto max-w-[1180px] px-4">
        <div className="grid grid-cols-1 md:relative md:min-h-[290px]">
          <div className="relative h-[220px] w-full md:absolute md:inset-y-0 md:left-0 md:h-auto md:w-[65%]">
            <Image
              src="/2019-edmund-blochinger-1492-granada-pine-pi-csar-5-765x286.webp"
              alt="Try any guitar with no purchase commitment"
              fill
              sizes="(max-width: 768px) 100vw, 65vw"
              className="object-contain object-center md:object-left"
            />
          </div>

          <div className="bg-white p-5 md:absolute md:bottom-0 md:right-0 md:flex md:h-[82%] md:w-[40%] md:flex-col md:justify-end md:px-5 md:pt-3 md:pb-0 lg:px-6">
            <div className="flex h-full flex-col justify-center md:justify-end">
              <div className="text-[24px] font-medium leading-[1.08] text-[#bb9b69] lg:text-[26px]">
                Try Any Guitar With No Purchase Commitment
              </div>
              <p className="mt-5 text-[13px] leading-6 text-black lg:text-[14px]">
                It is simple: You can choose a guitar from the GSI stock, and we&apos;ll ship it to you anywhere
                in the world for a trial period and approval.
              </p>
              <p className="mt-5 text-[13px] leading-6 text-black lg:text-[14px]">
                Trial period lasts 48 hour. Learn more about our 48-Hour Approval Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

