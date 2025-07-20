
'use client'
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Quote } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Testimonial = {
    id: string;
    quote: string;
    author_name: string;
    author_role: string | null;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.from('testimonials').select('*');
      if (data) {
        setTestimonials(data);
      }
    };
    fetchTestimonials();
  }, []);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-primary text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-body text-accent uppercase tracking-widest text-sm mb-4 block">Client Experience</span>
          <h2 className="font-headline text-4xl md:text-5xl mb-6">What Our Clients Say</h2>
          <p className="font-body text-white/80 leading-relaxed">Discover the experiences of our valued customers who have indulged in our artisanal chocolate creations.</p>
        </div>
        <Carousel 
          className="w-full"
          plugins={[
            Autoplay({
              delay: 6000,
              stopOnInteraction: true,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="bg-white/5 border-none text-white rounded-lg backdrop-blur-sm h-full flex flex-col">
                    <CardContent className="p-8 flex-grow flex flex-col justify-center text-center">
                      <Quote className="text-accent text-4xl mx-auto mb-6" />
                      <p className="font-body text-white/90 mb-8 leading-relaxed flex-grow">{testimonial.quote}</p>
                      <div>
                        <p className="font-headline text-xl mb-2">{testimonial.author_name}</p>
                        <p className="font-body text-white/60">{testimonial.author_role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
