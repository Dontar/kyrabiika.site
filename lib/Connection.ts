import { model, Schema, connect } from 'mongoose';
import { MenuItem, Order, User, PromotionItem } from './DbTypes';

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

export const PromotionItemModel = model<PromotionItem>('PromotionItem', new Schema<PromotionItem>({
  item: { type: Schema.Types.ObjectId, ref: 'MenuItem' }
}));

export const connectionString = process.env.SERVER_DB ?? 'mongodb://root:example@db:27017/?authSource=admin&readPreference=primary&ssl=false';
