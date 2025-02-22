
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const HeroCarousel = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 mix-blend-overlay z-10"></div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {/* Colorful Car Art */}
          <CarouselItem className="relative h-[600px] w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF719A] to-[#8B5CF6] opacity-30"></div>
            <img
              src="/lovable-uploads/830e13d0-5772-46d2-b986-7f8e3a6961b8.png"
              alt="Artistic colorful car design"
              className="w-full h-full object-cover bg-black"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 z-20" />
        <CarouselNext className="absolute right-4 top-1/2 z-20" />
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
