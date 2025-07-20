'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Image {
    url: string;
    alt: string | null;
}

interface ProductImageGalleryProps {
    images: Image[];
    badge: string | null;
}

export default function ProductImageGallery({ images, badge }: ProductImageGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0]);
    
    if (!images || images.length === 0) {
        return (
             <div className="aspect-[4/5] relative overflow-hidden rounded-lg shadow-lg bg-muted">
                <Image
                    src={'https://placehold.co/800x1000.png'}
                    alt="Placeholder Image"
                    fill
                    className="object-cover"
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="aspect-[4/5] relative overflow-hidden rounded-lg shadow-lg bg-muted">
                <Image
                    key={mainImage.url}
                    src={mainImage.url}
                    alt={mainImage.alt ?? 'Product Image'}
                    fill
                    className="object-cover animate-in fade-in-25"
                />
                {badge && <Badge variant="default" className="absolute top-4 right-4 bg-primary text-primary-foreground font-body">{badge}</Badge>}
            </div>
            {images.length > 1 && (
                 <div className="grid grid-cols-5 gap-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setMainImage(image)}
                            className={cn(
                                "aspect-square relative overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                mainImage.url === image.url ? 'ring-2 ring-primary ring-offset-2' : ''
                            )}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt ?? `Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
