'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CategoryFilters({ categories }: { categories: string[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get('category');

    const handleFilter = (category: string | null) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (!category) {
            current.delete("category");
        } else {
            current.set("category", category);
        }

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${pathname}${query}`);
    };

    return (
        <div className="flex flex-col items-start gap-2">
            <Button
                variant="ghost"
                onClick={() => handleFilter(null)}
                className={cn("w-full justify-start p-2 h-auto font-normal", !selectedCategory && "font-bold text-primary bg-primary/10")}
            >
                All
            </Button>
            {categories.map((category) => (
                <Button
                    key={category}
                    variant="ghost"
                    onClick={() => handleFilter(category)}
                    className={cn("w-full justify-start p-2 h-auto font-normal", selectedCategory === category && "font-bold text-primary bg-primary/10")}
                >
                    {category}
                </Button>
            ))}
        </div>
    );
}
