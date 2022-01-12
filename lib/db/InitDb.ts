import { models } from "mongoose";
import { MenuItemModel, SiteConfigModel } from "./Connection";
import initialData from "./initial-data.json";

export async function initDb(): Promise<void> {

  Object.entries(initialData).forEach(async ([collection, data]) => {
    const model = models[collection];
    const count = await model.countDocuments();
    if (count === 0) {
      await model.insertMany(data);
    }
  });

  const config = await SiteConfigModel.findOne();
  if (config?.promo_items.length === 0) {
    config.promo_items = await MenuItemModel.find().limit(6);
    await config.save();
  }
}
