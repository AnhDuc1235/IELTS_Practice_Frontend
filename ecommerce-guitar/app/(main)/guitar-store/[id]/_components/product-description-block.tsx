"use client";

interface ProductDescriptionBlockProps {
  description: string;
}

export default function ProductDescriptionBlock({ description }: ProductDescriptionBlockProps) {
  if (!description) {
    return null;
  }

  return (
    <section className="mb-8 bg-white px-5 py-6 lg:px-6">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-start md:gap-3">
        <div className="md:basis-[30%] md:pr-1">
          <div className="w-full border-t border-[#c9b58d] pt-[6px] text-right md:pl-6">
            <h2 className="text-[13px] font-bold uppercase leading-none tracking-[0.08em] text-[#b49564]">
              Description
            </h2>
          </div>
        </div>
        <div className="md:basis-[70%] md:pl-1">
          <p className="whitespace-pre-wrap -mt-[3px] text-left text-[14px] leading-[1.85] text-[#404040]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
