import { connect } from "mongoose";
import { pipeline } from "stream/promises";
import { connectionString, MenuItemModel } from "../../../lib/db/Connection";
import { MenuItem } from "../../../lib/db/DbTypes";
import { createJsonStream } from "../../../lib/utils/json-stream";
import rest from "../../../lib/utils/rest";

export default rest<MenuItem[]>()
  .get(async (_req, res) => {
    await connect(connectionString);
    const items = MenuItemModel.find().cursor();
    await pipeline(items, createJsonStream(), res);
  });
