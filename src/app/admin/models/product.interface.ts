import { ProductoResponse } from "./producto-response";

export interface Product {
    category: string;
    description: string;
    id: number;
    image: string;
    price: number;
    rating: { rate: number; count: number };
    title: string;
}
  
export interface ProductItemCart {
    product: ProductoResponse;
    quantity: number;
}
  