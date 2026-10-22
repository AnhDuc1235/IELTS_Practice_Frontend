import LogoutClient from "./_components/LogoutClient";
export default function LogoutPage() {
  return (
    <div className="bg-[#f5f5f5] text-black min-h-[70vh]">
      <div className="max-w-[1260px] mx-auto px-4 py-8">
        <div className="text-[13px] text-[#777] mb-5">Home / Account / Logout</div>
        <LogoutClient />
      </div>
    </div>
  );
}

