import { pipeline } from "stream/promises";
import fs from "fs/promises";
import path from "path";
import type { PageConfig } from "next";

import { db, MenuItemModel } from "../../../lib/db/Connection";
import { createJsonStream } from "../../../lib/utils/json-stream";
import rest from "../../../lib/utils/rest";
import formParser from "../../../lib/utils/form-parser";
import { imagesRootPath } from "../../../lib/utils/session";
import { MenuItem } from "../../../lib/db/DbTypes";

const handler = rest();

handler.use(db);
handler.use(formParser());

handler.withAuth.put<MenuItem>(async (req, res) => {
  const item = new MenuItemModel(req.body);
  const file = req.files.image;

  if (file && !Array.isArray(file)) {
    const filePath = path.join(imagesRootPath, item.name);
    await fs.mkdir(filePath, { recursive: true });
    await fs.copyFile(file.filepath, path.join(filePath, file.originalFilename!));
    await fs.unlink(file.filepath);
  }

  res.json(await item.save());
});

handler.withAuth.get(async (_req, res) => {
  const items = MenuItemModel.find().cursor();
  await pipeline(items, createJsonStream(), res);
});

export default handler;

export const config: PageConfig = {
  api: {
    bodyParser: false
  }
};
