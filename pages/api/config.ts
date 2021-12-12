// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { SiteConfigModel } from "../../lib/db/Connection"
import { SiteConfig } from "../../lib/db/DbTypes";

export default async function handler(req: NextApiRequest, res: NextApiResponse<SiteConfig>) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      const config = await SiteConfigModel.findOne().lean({ autopopulate: true });
      res.status(200).json(config!);
      break;

    case "POST":
      const data: SiteConfig = body;
      if (data._id) {
        const r = await SiteConfigModel.updateOne({ _id: data._id }, data);
        res.status(200).end();
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
