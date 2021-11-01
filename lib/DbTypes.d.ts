import { Require_id } from "mongoose";

interface MongoId {
  _id?: any;
}

export interface User extends MongoId {
  firstName: string;
  lastName: string;
  mail: string;
  password: string;
  admin?: boolean;
  phone?: string;
  address?: string;
  orders: Order[];
}

export interface MenuItem extends MongoId {
  name: string;
  category: string;
  price: number;
}

export interface OrderItem {
  item: MenuItem;
  count: number;
};

export type OrderProgress =
  'Confirmed' |
  'Processing' |
  'Preparing' |
  'Delivering' |
  'Delivered';

export interface Order extends MongoId {
  items: OrderItem[];
  date: Date;
  progress?: OrderProgress;
  user: User;
}

export interface PromotionItem extends MongoId {
  item: MenuItem;
}
