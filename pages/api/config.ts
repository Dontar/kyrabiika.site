import { SiteConfigModel } from "../../lib/db/Connection"
import { SiteConfig } from "../../lib/db/DbTypes";
import rest from "../../lib/utils/rest";

export default rest<SiteConfig>()
  .get(async (_req, res) => {
    const config = await SiteConfigModel.findOne().lean({ autopopulate: true });
    res.status(200).json(config!);
  })
  .post(async (req, res) => {
    const data: SiteConfig = req.body;
    if (data._id) {
      const r = await SiteConfigModel.updateOne({ _id: data._id }, data);
      res.status(200).end();
    }
  });
