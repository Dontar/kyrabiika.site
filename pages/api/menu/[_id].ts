import { connect } from "mongoose";
import { connectionString, MenuItemModel } from "../../../lib/db/Connection";
import { MenuItem } from "../../../lib/db/DbTypes";
import rest from "../../../lib/utils/rest";

export default rest<MenuItem>()
  .put(async (req, res) => {
    await connect(connectionString);
    const { _id } = req.query;
    await MenuItemModel.updateOne({ _id }, req.body);
    res.status(200).end();
  })
  .del(async (req, res) => {
    await connect(connectionString);
    const { _id } = req.query;
    await MenuItemModel.deleteOne({ _id });
    res.status(200).end();
  });
