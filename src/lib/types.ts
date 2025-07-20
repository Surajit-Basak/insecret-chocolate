export type Product = {
    id: string;
    created_at: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_best_seller: boolean | null;
    category: string | null;
    badge: string | null;
    meta_title: string | null;
    meta_description: string | null;
    ai_hint: string | null;
}

export type BlogPost = {
    id: string;
    created_at: string;
    title: string;
    slug: string;
    content: string | null;
    image_url: string | null;
    category: string | null;
    meta_title: string | null;
    meta_description: string | null;
    ai_hint: string | null;
};

export type Media = {
    id: string;
    created_at: string;
    name: string;
    url: string;
    alt_text: string | null;
}

export type ProductImage = {
    media_id: string;
    display_order: number;
    media: Media;
}

export type ProductWithImages = Product & {
    product_images: ProductImage[];
}

export type Category = {
    id: string;
    created_at: string;
    name: string;
    type: 'product' | 'blog';
}

export type Testimonial = {
    id: string;
    created_at: string;
    quote: string;
    author_name: string;
    author_role: string | null;
};

export type SiteSetting = {
    id: number;
    created_at: string;
    key: string;
    value: string | null;
    description: string | null;
    group: string | null;
    type: string | null;
};
