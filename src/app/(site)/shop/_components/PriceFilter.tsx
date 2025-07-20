'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function PriceFilter({ min, max }: { min: number; max: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialMin = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : min;
  const initialMax = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : max;
  
  const [priceRange, setPriceRange] = useState([initialMin, initialMax]);
  
  useEffect(() => {
    setPriceRange([
      searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : min,
      searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : max,
    ]);
  }, [searchParams, min, max]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const applyFilter = () => {
    startTransition(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        
        current.set('minPrice', String(priceRange[0]));
        current.set('maxPrice', String(priceRange[1]));

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${pathname}${query}`);
    });
  };

  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Price Range:</span>
        <span className="text-sm font-bold">₹{priceRange[0]} - ₹{priceRange[1]}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={10}
        value={priceRange}
        onValueChange={handlePriceChange}
        className="w-full"
      />
      <Button onClick={applyFilter} disabled={isPending} className="w-full">
         {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
         Apply Filter
      </Button>
    </div>
  );
}
