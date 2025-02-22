
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
          {/* Car Paint Transformation */}
          <CarouselItem className="relative h-[600px] w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFE29F] to-[#FF719A] opacity-40"></div>
            <img
              src="/lovable-uploads/fdf5c8c9-a1c3-41da-8d25-1a26353ee2b9.png"
              alt="Colorful car transformation"
              className="w-full h-full object-cover"
            />
          </CarouselItem>
          
          {/* Professional Work */}
          <CarouselItem className="relative h-[600px] w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] opacity-40"></div>
            <img
              src="/lovable-uploads/f52a2ef2-7bdc-4481-8eac-b1904e23a0db.png"
              alt="Professional panel beating"
              className="w-full h-full object-cover"
            />
          </CarouselItem>

          {/* Quality Service */}
          <CarouselItem className="relative h-[600px] w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F97316] to-[#D946EF] opacity-40"></div>
            <img
              src="/lovable-uploads/4b9c7bef-370d-4883-bfc7-2cd569e958bc.png"
              alt="Quality service"
              className="w-full h-full object-cover"
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
