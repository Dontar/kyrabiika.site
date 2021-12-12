import { connect } from "mongoose";
import { connectionString, MenuItemModel, SiteConfigModel } from "./Connection";
import { MenuItem } from "./DbTypes";
import initialData from "./initial-data.json";

export async function initDb(): Promise<void> {
  await connect(connectionString);
  let count = await MenuItemModel.countDocuments();
  let items: MenuItem[];

  if (count < 1) {
    items = (await MenuItemModel.insertMany(initialData.items)).slice(0, 6);
  } else {
    items = await MenuItemModel.find().limit(6);
  }

  count = await SiteConfigModel.countDocuments();
  if (count < 1) {
    const config = await SiteConfigModel.create({
      ...initialData.system_config,
      promo_items: items
    });
    await config.save();
  }
}
