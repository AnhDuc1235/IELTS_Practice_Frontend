import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Dữ liệu danh sách banner ảnh thật
const banners = [
  {
    id: 1,
    imageUrl: '/banner_1.png',
    alt: 'Banner 1 - Nền tảng đào tạo và luyện thi IELTS online hàng đầu',
    link: '/tests',
  },
  {
    id: 2,
    imageUrl: '/banner_2.png',
    alt: 'Banner 2 - Kho đề thi Cambridge chuẩn quốc tế',
    link: '/tests',
  },
];

export default function HomePage() {
  // Quản lý slide banner (chỉ dùng 1 state duy nhất cho banner)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Tự động chuyển banner sau mỗi 6 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Chuyển slide tiếp theo (vòng lặp: banner cuối bấm tiếp về đầu)
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  // Lùi slide trước đó (vòng lặp: banner đầu lùi về cuối)
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Khi bấm Đăng ký tư vấn: alert và reset form thuần túy (không cần tạo state cho từng input)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Đăng ký nhận thông tin thành công! Learnly sẽ sớm liên hệ với bạn.');
    e.currentTarget.reset();
  };

  const slide = banners[currentSlide];

  return (
    <div className="w-full">
      {/* 1. Hero Banner Slider */}
      <section className="relative group w-full overflow-hidden select-none bg-gray-50">
        <Link to={slide.link} className="block w-full">
          <img
            src={slide.imageUrl}
            alt={slide.alt}
            className="w-full h-auto block object-cover"
          />
        </Link>

        {/* Nút back slide */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/40 hover:bg-black/60 rounded-full p-2 cursor-pointer shadow-md"
          title="Slide trước"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Nút next slide */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/40 hover:bg-black/60 rounded-full p-2 cursor-pointer shadow-md"
          title="Slide tiếp theo"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Các chấm tròn chuyển slide ở phía dưới */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${currentSlide === idx ? 'bg-white w-7' : 'bg-white/50 w-2.5 hover:bg-white/80'
                }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Tính năng Luyện đề - 2 thẻ xếp chéo, thẻ sau đè lên thẻ trước */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Thẻ 1: tiêu đề (góc trên trái) */}
          <div
            className="w-[54%] bg-cover bg-center bg-no-repeat text-white rounded-2xl p-8 pb-64 relative overflow-hidden"
            style={{ backgroundImage: "url('/image11.png')" }}
          >
          </div>

          {/* Thẻ 2: nội dung (góc dưới phải, đè chéo lên thẻ 1 một chút) */}
          <div className="w-[54%] ml-auto -mt-20 p-5 rounded-2xl bg-white relative min-h-[288px] flex flex-col gap-5">
            <ul className="space-y-2 text-[rgba(6,41,98,1)] text-[20px]">
              <li>• <strong>Kho đề IELTS phong phú bám sát cấu trúc thi.</strong></li>
              <li>• <strong>Giao diện giống thi thật:</strong> Trải nghiệm thân thiện, đúng chuẩn.</li>
              <li>• <strong>Tự chọn part và thời gian:</strong> Theo nhu cầu ôn luyện.</li>
              <li>• <strong>Đa dạng công cụ:</strong> Highlight, ghi chú, tra từ điển.</li>
              <li>• <strong>kết quả trực quan:</strong> Có đánh giá và giải thích chi tiết.</li>
            </ul>

            <Link
              to="/tests"
              className="inline-block bg-[rgba(6,41,98,1)] text-white font-medium px-4 py-2 rounded hover:opacity-90 text-sm transition-opacity self-start"
            >
              Khám phá kho đề thi
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Đăng ký thông tin mới nhất từ Learnly */}
      <section
        id="register"
        className="relative bg-cover bg-center bg-no-repeat text-white py-14"
        style={{ backgroundImage: "url('/NIRN_blog_voices_series_1.png')" }}
      >
        {/* Lớp phủ mờ giúp chữ và form luôn nổi bật, dễ đọc */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-md mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold drop-shadow-md">Đăng ký nhận thông tin mới nhất <br />từ Learnly</h2>
          </div>

          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Nhập địa chỉ email của bạn"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[rgba(6,41,98,1)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  placeholder="Nhập số điện thoại"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[rgba(6,41,98,1)]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[rgba(6,41,98,1)] text-white font-semibold py-2.5 rounded hover:opacity-90 text-sm mt-2 transition-opacity cursor-pointer"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
