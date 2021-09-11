import { model, Schema } from 'mongoose';

interface User {
    firstName: string;
    lastName: string;
    mail: string;
    phone?: string;
    address?: string;
    orders: Order[];
}

interface MenuItem {
    name: string;
    price: number;
    pic: string;
}

interface Order {
    items: MenuItem[];
    date: Date;
    progress: string;
    user: User;
}

export const MenuItemModel = model<MenuItem>('MenuItem', new Schema<MenuItem>({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    pic: { type: String, required: true },
}));

export const OrderModel = model<Order>('Order', new Schema<Order>({
    items: [{ type: Schema.Types.ObjectId, ref: 'MenuItem' }],
    date: Date,
    progress: { type: String, enum: ['Prepearing', 'Enroute', 'Delivered'] },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}));

export const UserModel = model<User>('User', new Schema<User>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    phone: String,
    address: String,
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
}));
