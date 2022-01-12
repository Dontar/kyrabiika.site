import type { PageConfig } from "next";
import path from "path";
import fs from "fs/promises";

import { db, MenuItemModel } from "../../../lib/db/Connection";
import { MenuItem } from "../../../lib/db/DbTypes";
import formParser from "../../../lib/utils/form-parser";
import rest from "../../../lib/utils/rest";
import { imagesRootPath } from "../../../lib/utils/session";

const handler = rest();

handler.use(db);
handler.use(formParser());

handler.patch(async (req, res) => {
  const { _id } = req.query;
  const file = req.files.image;
  const item = req.body as MenuItem;

  if (file && !Array.isArray(file)) {
    const filePath = path.join(imagesRootPath, item.name);
    await fs.mkdir(filePath, { recursive: true });
    await fs.copyFile(file.filepath, path.join(filePath, file.originalFilename!));
    await fs.unlink(file.filepath);
  }

  await MenuItemModel.updateOne({ _id }, item);
  res.json(item);
});

handler.del(async (req, res) => {
  const { _id } = req.query;
  await MenuItemModel.deleteOne({ _id });
  res.status(200).end();
});

export default handler;

export const config: PageConfig = {
  api: {
    bodyParser: false
  }
};
