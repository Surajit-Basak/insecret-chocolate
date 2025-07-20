import Image from 'next/image';

const flavors = [
  {
    image: 'https://placehold.co/600x800.png',
    title: 'Dark Chocolate',
    description: 'Rich & Complex Notes',
  },
  {
    image: 'https://placehold.co/600x800.png',
    title: 'White Chocolate',
    description: 'Smooth & Creamy',
  },
  {
    image: 'https://placehold.co/600x800.png',
    title: 'Milk Chocolate',
    description: 'Perfectly Balanced',
  },
  {
    image: 'https://placehold.co/600x800.png',
    title: 'Signature Collection',
    description: 'Curated Excellence',
  },
];

type SymphonyOfFlavorsProps = {
  settings: {
    flavors_tagline: string;
    flavors_title: string;
    flavors_description: string;
  }
}

const SymphonyOfFlavors = ({ settings }: SymphonyOfFlavorsProps) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-body text-accent uppercase tracking-widest text-sm mb-4 block">{settings.flavors_tagline}</span>
          <h2 className="font-headline text-4xl md:text-5xl mb-6">{settings.flavors_title}</h2>
          <p className="font-body text-muted-foreground leading-relaxed">{settings.flavors_description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {flavors.map((flavor, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
              <Image 
                src={flavor.image} 
                alt={flavor.title} 
                width={600}
                height={800}
                className="w-full h-[450px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="font-headline text-xl text-white mb-2">{flavor.title}</h3>
                  <p className="font-body text-white/80 text-sm">{flavor.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SymphonyOfFlavors;
