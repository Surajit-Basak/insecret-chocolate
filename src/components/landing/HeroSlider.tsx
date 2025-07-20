"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stats = [
    { value: "15+", label: "Years of Excellence" },
    { value: "50+", label: "Unique Flavors" },
    { value: "100%", label: "Handcrafted" },
]

type HeroSliderProps = {
  settings: {
    hero1_tagline: string;
    hero1_title: string;
    hero1_description: string;
    hero1_image_url: string;
    hero2_tagline: string;
    hero2_title: string;
    hero2_description: string;
    hero2_image_url: string;
    hero3_tagline: string;
    hero3_title: string;
    hero3_description: string;
    hero3_image_url: string;
  }
}

const HeroSlider = ({ settings }: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const potentialSlides = [
    {
      id: 1,
      image: settings.hero1_image_url,
      tagline: settings.hero1_tagline,
      title: settings.hero1_title,
      description: settings.hero1_description,
    },
    {
      id: 2,
      image: settings.hero2_image_url,
      tagline: settings.hero2_tagline,
      title: settings.hero2_title,
      description: settings.hero2_description,
    },
    {
      id: 3,
      image: settings.hero3_image_url,
      tagline: settings.hero3_tagline,
      title: settings.hero3_title,
      description: settings.hero3_description,
    }
  ];

  // Filter out slides that don't have a title, as they are likely not configured
  const slides = potentialSlides.filter(slide => slide.title);


  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % (slides.length || 1));
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);
  
  if(slides.length === 0) {
      return (
        <section className="relative h-screen min-h-[700px] overflow-hidden bg-primary flex items-center justify-center text-white">
            <div className="text-center p-8">
                <h1 className="font-headline text-4xl">Configure Homepage Hero Slider</h1>
                <p className="font-body mt-4">Please add content for the hero sliders in the admin panel under Pages > Home Page.</p>
                <Button asChild variant="secondary" className="mt-8">
                  <Link href="/admin">Go to Admin</Link>
                </Button>
            </div>
        </section>
      )
  }

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-primary">
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="flex-none w-full h-full relative"
          >
            <div className="relative w-full h-full">
                <Image
                    src={slide.image || "https://placehold.co/1920x1080.png"}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
            <div className="container mx-auto px-6 absolute inset-0 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <div className="mb-8">
                  <span className="inline-block font-body text-accent tracking-widest uppercase text-sm mb-4">
                    {slide.tagline}
                  </span>
                  <h1 className="font-headline text-5xl md:text-7xl text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="font-body text-lg text-white/90 mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild variant="secondary" size="lg" className="px-10 py-6 font-body text-sm tracking-wider uppercase rounded-button">
                      <Link href="/shop">Explore Collection</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="px-10 py-6 font-body text-sm tracking-wider uppercase rounded-button border-white/50 text-white hover:bg-white/10 hover:text-white">
                      <Link href="/about">Our Process</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-8 mt-16">
                  {stats.map((stat, statIndex) => (
                    <React.Fragment key={stat.label}>
                      <div className="text-center">
                        <p className="font-headline text-3xl text-accent mb-2">{stat.value}</p>
                        <p className="font-body text-white/80 text-xs sm:text-sm uppercase tracking-wider">{stat.label}</p>
                      </div>
                      {statIndex < stats.length - 1 && <div className="h-12 w-px bg-white/20"></div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

     {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
            {slides.map((_, index) => (
            <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                }`}
            />
            ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;