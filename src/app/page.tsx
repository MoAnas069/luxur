import HeroScroll from "@/components/HeroScroll";
import ImmersiveStatement from "@/components/home/ImmersiveStatement";
import SourcingShowcase from "@/components/home/SourcingShowcase";
import PrivateCatalogue from "@/components/home/PrivateCatalogue";
import Transformation from "@/components/home/Transformation";
import ServicesTimeline from "@/components/home/ServicesTimeline";
import TestimonialCinema from "@/components/home/TestimonialCinema";

export default function Home() {
  return (
    <div className="w-full bg-lux-bg">
      <HeroScroll />
      <ImmersiveStatement />
      <SourcingShowcase />
      <PrivateCatalogue />
      <Transformation />
      <ServicesTimeline />
      <TestimonialCinema />
    </div>
  );
}
