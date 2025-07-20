import ProductCard from "./_components/ProductCard";
import CategoryFilters from "./_components/CategoryFilters";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import PriceFilter from "./_components/PriceFilter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default async function ShopPage({ searchParams }: { searchParams?: { category?: string, minPrice?: string, maxPrice?: string } }) {
  const supabase = createSupabaseServerClient();
  const selectedCategory = searchParams?.category;
  const minPrice = searchParams?.minPrice ? parseInt(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? parseInt(searchParams.maxPrice) : undefined;

  let query = supabase.from('products').select('*');
  if (selectedCategory) {
      query = query.eq('category', selectedCategory);
  }
  if (minPrice) {
      query = query.gte('price', minPrice);
  }
  if (maxPrice) {
      query = query.lte('price', maxPrice);
  }

  const { data: products } = await query;
  const { data: categoriesData } = await supabase.from('categories').select('name').eq('type', 'product');
  const categories = categoriesData?.map(c => c.name) || [];
  
  const { data: priceData } = await supabase.rpc('get_min_max_product_price');
  const defaultMinPrice = priceData?.min_price ?? 0;
  const defaultMaxPrice = priceData?.max_price ?? 5000;

  const FiltersComponent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 font-headline">Categories</h3>
        <CategoryFilters categories={categories} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 font-headline">Price Range</h3>
        <PriceFilter min={defaultMinPrice} max={defaultMaxPrice} />
      </div>
    </div>
  );

  return (
    <main>
      <section className="py-20 text-center bg-primary text-white">
          <h1 className="text-5xl font-headline">Our Chocolate Collection</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">Artisanal chocolates crafted with passion and the finest ingredients.</p>
      </section>
      <section className="py-12 md:py-24">
          <div className="container mx-auto px-6">
              <div className="flex gap-12">
                  {/* Desktop Sidebar */}
                  <aside className="hidden lg:block w-1/4 xl:w-1/5 sticky top-28 h-fit">
                    <FiltersComponent />
                  </aside>

                  {/* Mobile Filters */}
                  <div className="lg:hidden mb-8 w-full">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                           <Filter className="mr-2 h-4 w-4" />
                           Filter
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left">
                         <SheetHeader>
                           <SheetTitle className="font-headline text-2xl">Filters</SheetTitle>
                         </SheetHeader>
                         <div className="py-8">
                            <FiltersComponent />
                         </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  <div className="flex-1">
                      {products && products.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                              {products.map((product) => (
                                  <ProductCard key={product.id} product={product} />
                              ))}
                          </div>
                      ) : (
                          <div className="text-center py-20 w-full col-span-full">
                              <p className="text-muted-foreground text-lg">No products found for the selected filters.</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </section>
    </main>
  );
}
