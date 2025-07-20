'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ProductEnquiryDialog from "./ProductEnquiryDialog";
import { type Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group border-none rounded-button flex flex-col">
            <CardHeader className="p-0">
                <Link href={`/shop/${product.slug}`}>
                    <div className="aspect-[4/3] relative overflow-hidden">
                    <Image 
                        src={product.image_url ?? 'https://placehold.co/600x450.png'}
                        alt={product.title} 
                        fill
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.badge && <Badge variant="default" className="absolute top-4 right-4 bg-primary text-primary-foreground font-body">{product.badge}</Badge>}
                    </div>
                </Link>
            </CardHeader>
            <CardContent className="p-6 pb-4 flex-grow">
                 <Link href={`/shop/${product.slug}`}>
                    <CardTitle className="font-headline text-xl mb-2 hover:text-accent transition-colors">{product.title}</CardTitle>
                 </Link>
                {product.description && <div className="font-body text-muted-foreground mb-4 prose prose-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: product.description }} />}
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between items-center mt-auto">
                <span className="font-headline text-xl text-foreground">₹{product.price}</span>
                <ProductEnquiryDialog product={product} />
            </CardFooter>
        </Card>
    )
}
