export interface User {
  firstName: string;
  lastName: string;
  mail: string;
  password: string;
  admin?: boolean;
  phone?: string;
  address?: string;
  orders: Order[];
}

export interface MenuItem {
  name: string;
  category: string;
  price: number;
}
export type OrderItem = {
  item: MenuItem;
  count: number;
};
export type OrderProgress =
  'Confirmed' |
  'Processing' |
  'Preparing' |
  'Delivering' |
  'Delivered';


export interface Order {
  items: OrderItem[];
  date: Date;
  progress: OrderProgress;
  user: User;
}

export interface PromotionItem {
  item: MenuItem;
}
