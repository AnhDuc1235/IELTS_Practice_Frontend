import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-[#f5f5f5] min-h-[70vh]">
      <div className="max-w-[1260px] mx-auto px-4 py-10">
        <div className="border border-[#d8d8d8] bg-white p-8">
          <h1 className="text-[42px] font-semibold">Page Not Found</h1>
          <p className="text-[16px] text-[#555] mt-3">
            The page you are looking for does not exist.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-block bg-[rgb(187,155,105)] text-black px-7 py-2 text-[14px] font-semibold"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

