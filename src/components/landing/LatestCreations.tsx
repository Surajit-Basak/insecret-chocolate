import { Gift, Store, CakeSlice, Medal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const creations = [
  {
    icon: <Gift className="text-primary text-2xl" />,
    title: "Luxury Gift Sets",
    description: "Curated collections perfect for special occasions"
  },
  {
    icon: <Store className="text-primary text-2xl" />,
    title: "Boutique Experience",
    description: "Visit our elegant stores for personal service"
  },
  {
    icon: <CakeSlice className="text-primary text-2xl" />,
    title: "Custom Orders",
    description: "Personalized creations for your events"
  },
  {
    icon: <Medal className="text-primary text-2xl" />,
    title: "Quality Guarantee",
    description: "Excellence in every chocolate piece"
  }
];

type LatestCreationsProps = {
  settings: {
    creations_tagline: string;
    creations_title: string;
    creations_description: string;
    creations_bg_image_url: string;
  }
}

const LatestCreations = ({ settings }: LatestCreationsProps) => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-5" style={{ backgroundImage: `url('${settings.creations_bg_image_url || 'https://placehold.co/1920x1080.png'}')` }}></div>
      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-body text-accent uppercase tracking-widest text-sm mb-4 block">{settings.creations_tagline}</span>
          <h2 className="font-headline text-4xl md:text-5xl mb-6">{settings.creations_title}</h2>
          <p className="font-body text-muted-foreground leading-relaxed">{settings.creations_description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {creations.map((creation, index) => (
            <Card key={index} className="text-center shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-button border-none">
              <CardContent className="p-8">
                <div className="w-20 h-20 flex items-center justify-center bg-background rounded-full mx-auto mb-6">
                  {creation.icon}
                </div>
                <CardTitle className="font-headline text-xl mb-4">{creation.title}</CardTitle>
                <CardDescription className="font-body text-muted-foreground">{creation.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestCreations;
