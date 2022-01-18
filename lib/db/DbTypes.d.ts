import { Require_id } from "mongoose";

interface MongoId {
  _id?: any;
}

export interface User extends MongoId {
  firstName: string;
  lastName: string;
  mail: string;
  password: string;
  roles?: string[];
  phone?: string;
  address?: string;
  address_pos: google.maps.LatLngLiteral;
  orders: Order[];
}

export interface MenuItem extends MongoId {
  name: string;
  category: string;
  price: number;
  description: string;
}

export interface OrderItem {
  item: MenuItem;
  count: number;
}

export type OrderProgress =
  "Confirmed" |
  "Processing" |
  "Preparing" |
  "Delivering" |
  "Delivered";

export interface Order extends MongoId {
  items: OrderItem[];
  date: Date;
  progress?: OrderProgress;
  user: User;
}

export interface SiteConfig extends MongoId {
  mission_statement: string;
  address: string;
  small_promo: string;
  addr_worktime: string;
  promo_items: MenuItem[];
}

export interface LoggedInUser extends User {
  isLoggedIn?: boolean;
}
