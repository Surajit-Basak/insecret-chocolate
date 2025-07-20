import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type BestSellersProps = {
  settings: {
    bestsellers_tagline: string;
    bestsellers_title: string;
    bestsellers_description: string;
  }
}

const BestSellers = async ({ settings }: BestSellersProps) => {
  const supabase = createSupabaseServerClient();
  const { data: bestSellers } = await supabase
    .from('products')
    .select('*')
    .eq('is_best_seller', true)
    .limit(4);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-body text-accent uppercase tracking-widest text-sm mb-4 block">{settings.bestsellers_tagline}</span>
          <h2 className="font-headline text-4xl md:text-5xl mb-6">{settings.bestsellers_title}</h2>
          <p className="font-body text-muted-foreground leading-relaxed">{settings.bestsellers_description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers?.map((product, index) => (
            <Card key={index} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group border-none rounded-button">
              <CardHeader className="p-0">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image 
                    src={product.image_url ?? 'https://placehold.co/600x750.png'} 
                    alt={product.title} 
                    width={600}
                    height={750}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {product.badge && <Badge variant="default" className="absolute top-4 right-4 bg-primary text-primary-foreground font-body">{product.badge}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="p-6 pb-4">
                <CardTitle className="font-headline text-xl mb-2">{product.title}</CardTitle>
                <CardDescription className="font-body text-muted-foreground mb-4">{product.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <span className="font-headline text-xl text-foreground">₹{product.price}</span>
                <Button variant="default" className="font-body text-sm rounded-button">Enquire Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
