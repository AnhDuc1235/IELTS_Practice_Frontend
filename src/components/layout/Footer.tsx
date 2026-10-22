export default function Footer() {
  return (
    <footer
      className="bg-[#062962] text-white mt-auto"
      style={{ backgroundColor: 'rgb(6, 41, 98)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Logo Learnly màu trắng */}
        <div className="mb-4">
          <img src="/learnly-logo-white.png" alt="Learnly" className="h-9 w-auto" />
        </div>

        {/* Thông tin doanh nghiệp */}
        <div className="space-y-2 text-[13.5px] text-blue-100 leading-relaxed">
          <p className="font-semibold text-white text-[15px]">CÔNG TY TNHH CÔNG NGHỆ VÀ GIÁO DỤC LEARNLY VIỆT NAM</p>
          <p>Hotline: 091-106-6992 | Email: support.team@learnly.vn</p>
          <p>Địa chỉ: Số 15, Ngõ 208 Giải Phóng, Phương Liệt, Quận Thanh Xuân, Thành phố Hà Nội</p>
          <p>Giấy phép ĐKKD: 0109675459 do Sở Kế hoạch và Đầu tư Hà Nội cấp</p>
          <p>CS1: TRUNG TÂM NGOẠI NGỮ LEARNLY - Số 17, Ngõ 208 Giải Phóng, Phường Phương Liệt, Quận Thanh Xuân, Thành phố Hà Nội, Việt Nam - Quyết định cho phép Trung tâm ngoại ngữ hoạt động số 2654/QĐ-SGDĐT Hà Nội. Quyết định thành lập Trung tâm ngoại ngữ hoạt động luyện thi IELTS, TOEIC, HSKK, TOPIK, JLPT số 540/QĐ-UBND Phường Phương Liệt - TP Hà Nội.</p>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="mt-6 pt-4 pb-4 border-t border-white/20 text-center text-[13px] text-blue-200">
        <p>© 2026 LEARNLY. All rights reserved.</p>
      </div>
    </footer>
  );
}

export { Footer };
