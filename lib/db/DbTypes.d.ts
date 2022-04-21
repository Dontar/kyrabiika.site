interface MongoId {
  _id?: any;
}

export type Address = {
  id: string;
  completeAddress: string;
  city?: string;
  complex?: string;
  street?: string;
  streetNum?: string;
  zip?: string;
  building?: string;
  entrance?: string;
  floor?: string;
  apartment?: string;
  address_pos?: google.maps.LatLngLiteral;
}

export interface User extends MongoId {
  firstName: string;
  lastName?: string;
  mail: string;
  password: string;
  roles?: string[];
  phone?: string;
  address?: Address[];
  // address_pos?: google.maps.LatLngLiteral;
  orders?: Order[];
  google?: string;
  facebook?: string;
  github?: string | undefined | null;
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
  delivery: number;
  // user: User;
  name: string;
  mail: string;
  phone: string;
  selectedAddress: string;
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
  password?: string;
}

export interface RandomToken extends MongoId {
  mail: string;
  token: string
}
