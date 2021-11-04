import { model, Schema, models, Model } from 'mongoose';
import { MenuItem, Order, User, PromotionItem } from './DbTypes';

export const MenuItemModel: Model<MenuItem> = models.MenuItem || model('MenuItem', new Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true }
}));

export const OrderModel: Model<Order> = models.Order || model('Order', new Schema({
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

export const UserModel: Model<User> = models.User || model('User', new Schema({
  firstName: String,
  lastName: String,
  mail: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  admin: Boolean,
  password: { type: String, required: true }
}));

export const PromotionItemModel: Model<PromotionItem> = models.PromotionItem || model('PromotionItem', new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'MenuItem' }
}));

export const connectionString = process.env.SERVER_DB ?? 'mongodb://root:example@db:27017/kyrabiika?authSource=admin&readPreference=primary&ssl=false';
