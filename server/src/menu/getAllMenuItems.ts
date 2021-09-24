import { MenuItem, MenuItemModel } from '../connection';

export default async function getAllMenuItems(): Promise<MenuItem[]> {
  const items = await MenuItemModel.find();
  return items.map((item) => item.toJSON());
}
