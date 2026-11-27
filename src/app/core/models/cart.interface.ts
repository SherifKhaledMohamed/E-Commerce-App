import { Product } from "./product.interface";

export interface cart {
  status: string;
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: cartData;
}

export interface cartData {
  _id: string;
  cartOwner: string;
  products: cartProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface cartProduct {
  count: number;
  _id: string;
  product: string;
  price: number;
}

export interface productOfCart {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

export interface GuestCartItem {
  count: number;
  price: number;
  product: Product;
  productId?: string;
}
