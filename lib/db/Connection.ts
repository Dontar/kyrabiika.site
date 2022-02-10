import { model, Schema, models, Model, connect as mnConnect, plugin } from "mongoose";
import { MenuItem, Order, User, SiteConfig } from "./DbTypes";
import autopopulate from "mongoose-autopopulate";

plugin(autopopulate);

Schema.Types.ObjectId.get(v => v?.toString() ?? v);

export const MenuItemModel: Model<MenuItem> = models.MenuItem || model("MenuItem", new Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: String
}));

export const OrderModel: Model<Order> = models.Order || model("Order", new Schema({
  items: [
    {
      item: { type: Schema.Types.ObjectId, ref: "MenuItem", autopopulate: true },
      count: Number
    }
  ],
  date: Date,
  progress: {
    type: String, enum: [
      "Confirmed",
      "Processing",
      "Preparing",
      "Delivering",
      "Delivered"
    ]
  },
  user: { type: Schema.Types.ObjectId, ref: "User" }
}));

export const UserModel: Model<User> = models.User || model("User", new Schema({
  firstName: String,
  lastName: String,
  mail: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  address_pos: {
    lat: Number,
    lng: Number
  },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order", autopopulate: true }],
  roles: { type: [String], required: true, default: ["User"] },
  password: { type: String, required: true },
  google: String,
  facebook: String,
  github: String
}));

export const SiteConfigModel: Model<SiteConfig> = models.SiteConfig || model("SiteConfig", new Schema({
  mission_statement: String,
  address: String,
  small_promo: String,
  addr_worktime: String,
  promo_items: [{ type: Schema.Types.ObjectId, ref: "MenuItem", autopopulate: true }]
}));

export const connectionString = process.env.DB_SERVER ?? "mongodb://root:example@db:27017/kyrabiika?authSource=admin&readPreference=primary&ssl=false";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mnConnect(connectionString, opts);
  }
  cached.conn = await cached.promise;

  return cached.conn;
}

export function db(_req: any, _res: any, next?: (result: unknown) => unknown) {
  connect().then(db => next!(db)).catch(err => next!(err));
}
