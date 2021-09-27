import { model, Schema } from 'mongoose';

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

type OrderItem = {
  item: MenuItem;
  count: number;
};

type OrderProgress =
  'Confirmed' |
  'Processing' |
  'Preparing' |
  'Delivering' |
  'Delivered'


export interface Order {
  items: OrderItem[];
  date: Date;
  progress: OrderProgress;
  user: User;
}

export interface PromotionItem {
  item: MenuItem;
}

export const MenuItemModel = model<MenuItem>('MenuItem', new Schema<MenuItem>({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true }
}));

export const OrderModel = model<Order>('Order', new Schema<Order>({
  items: [
    {
      item: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
      count: Number
    }
  ],
  date: Date,
  progress: {
    type: String, enum: [
      'Confirmed',
      'Processing',
      'Preparing',
      'Delivering',
      'Delivered'
    ]
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}));

export const UserModel = model<User>('User', new Schema<User>({
  firstName: String,
  lastName: String,
  mail: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  admin: Boolean,
  password: { type: String, required: true }
}));

export const PromotionItem = model<PromotionItem>('PromotionItem', new Schema<PromotionItem>({
  item: { type: Schema.Types.ObjectId, ref: 'MenuItem' }
}));

export async function initDb(): Promise<void> {
  const count = await MenuItemModel.count();

  if (count < 1) {
    await MenuItemModel.insertMany([
      { category: 'банички и соленки', name: 'баничка с козе сирене и спанак', price: 1 },
      { category: 'банички и соленки', name: 'баничка със сирене и подправки', price: 1 },
      { category: 'курабийки и бисквити', name: 'курабийки', price: 1 },
      { category: 'мини тарталети и кишове', name: 'тарталети с кленов сироп и орех', price: 1 },
      { category: 'мини тарталети и кишове', name: 'тарталети с крем маскарпоне', price: 1 },
      { category: 'мини тарталети и кишове', name: 'тарталети с ментов крем', price: 1 },
      { category: 'мини тарталети и кишове', name: 'чийзкейк в гнездо с горски плодове', price: 1 },
      { category: 'мъфини и къпкейкове', name: 'банофи пай', price: 1 },
      { category: 'мъфини и къпкейкове', name: 'къпкейк с шамфъстък', price: 1 },
      { category: 'мъфини и къпкейкове', name: 'мъфин с морков', price: 1 },
      { category: 'торти', name: 'тарт с плодове', price: 1 }
    ]);
  }
}
