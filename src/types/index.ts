export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category_id: string;
  category?: Category;
  short_desc: string;
  description: string;
  ingredients?: string;
  benefits: string[];
  price: number;
  price_label?: string;
  image_url: string;
  images?: string[];
  tags: string[];
  is_featured: boolean;
  is_available: boolean;
  sort_order: number;
  whatsapp_msg?: string;
}

export interface BrandConfig {
  id: string;
  key: string;
  value: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'phone';
}
