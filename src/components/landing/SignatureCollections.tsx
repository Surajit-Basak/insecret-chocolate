import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const collections = [
  {
    image: 'https://placehold.co/800x600.png',
    title: 'Luxury Bars',
    description: 'Single-origin chocolate bars crafted with precision',
  },
  {
    image: 'https://placehold.co/800x600.png',
    title: 'Gift Boxes',
    description: 'Curated selections for special occasions',
  },
  {
    image: 'https://placehold.co/800x600.png',
    title: 'Artisanal Bonbons',
    description: 'Handcrafted pieces with unique flavors',
  },
];

type SignatureCollectionsProps = {
  settings: {
    collections_tagline: string;
    collections_title: string;
    collections_description: string;
  }
}

const SignatureCollections = ({ settings }: SignatureCollectionsProps) => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-body text-accent uppercase tracking-widest text-sm mb-4 block">{settings.collections_tagline}</span>
          <h2 className="font-headline text-4xl md:text-5xl mb-6">{settings.collections_title}</h2>
          <p className="font-body text-muted-foreground leading-relaxed">{settings.collections_description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Card key={index} className="overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-button border-none">
              <CardHeader className="p-0">
                <div className="aspect-[4/3] relative">
                  <Image 
                    src={collection.image} 
                    alt={collection.title} 
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="font-headline text-xl mb-2">{collection.title}</CardTitle>
                <p className="font-body text-muted-foreground mb-4">{collection.description}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild variant="secondary" className="font-body rounded-button">
                  <Link href="/shop">Shop Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignatureCollections;
