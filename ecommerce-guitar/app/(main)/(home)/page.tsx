import HeroBanner from "./_components/hero-banner";
import GuitarCarousel from "./_components/guitar-carousel";
import ReviewsSection from "./_components/reviews";
import TryGuitarSection from "./_components/try-guitar";
import HomeIntroBand from "./_components/HomeIntroBand";
import HomeFeaturedArticles from "./_components/HomeFeaturedArticles";
import FindDreamGuitarSection from "./_components/find-dream-guitar";

export default function HomePage() {
  return (
    <div className="bg-white text-black">
      <HeroBanner />
      <GuitarCarousel />
      <FindDreamGuitarSection />
      <TryGuitarSection />
      <HomeFeaturedArticles />
      <ReviewsSection />
      <HomeIntroBand />
    </div>
  );
}
