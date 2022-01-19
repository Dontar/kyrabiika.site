import { db, SiteConfigModel } from "../../lib/db/Connection";
import { SiteConfig } from "../../lib/db/DbTypes";
import rest from "../../lib/utils/rest";

const handler = rest();

handler.use(db);

handler.get(async (_req, res) => {
  const config = await SiteConfigModel.findOne().lean({ autopopulate: true });
  res.json(config!);
});

handler.withAuth.post<SiteConfig>(async (req, res) => {
  const data = req.body;
  if (data._id) {
    const r = await SiteConfigModel.updateOne({ _id: data._id }, data);
    res.status(200).end();
  }
});

export default handler;
