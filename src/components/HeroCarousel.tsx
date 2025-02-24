import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const HeroCarousel = () => {
  const slides = [
    {
      image: "/images/hero/car-1.jpg",
      gradientFrom: "#FF719A",
      gradientTo: "#8B5CF6",
      alt: "Sleek black sports car with dramatic lighting"
    },
    {
      image: "/images/hero/car-2.jpg",
      gradientFrom: "#00C853",
      gradientTo: "#2196F3",
      alt: "Modern luxury vehicle in showroom"
    },
    {
      image: "/images/hero/car-3.jpg",
      gradientFrom: "#FF6D00",
      gradientTo: "#F50057",
      alt: "Classic red sports car on display"
    },
    {
      image: "/images/hero/car-4.jpg",
      gradientFrom: "#6200EA",
      gradientTo: "#00BFA5",
      alt: "Metallic luxury sedan in studio"
    }
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-20"></div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-[600px] w-full">
              {/* Gradient overlay */}
              <div 
                className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  background: `linear-gradient(45deg, ${slide.gradientFrom}, ${slide.gradientTo})`
                }}
              />
              
              {/* Paint splash effect */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${slide.gradientFrom}, ${slide.gradientTo})`
                }}
              />

              {/* Main image */}
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/hero/fallback.jpg"; // Local fallback image
                  console.error(`Failed to load image: ${slide.image}`);
                }}
              />

              {/* Dynamic color drips effect */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/50"></div>
              <div 
                className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${slide.gradientFrom})`,
                  opacity: 0.7
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom navigation buttons */}
        <CarouselPrevious className="absolute left-4 top-1/2 z-30 bg-white/10 hover:bg-white/20 border-none" />
        <CarouselNext className="absolute right-4 top-1/2 z-30 bg-white/10 hover:bg-white/20 border-none" />
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
