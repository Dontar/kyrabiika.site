// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { pipeline } from 'stream/promises';
import { MenuItemModel } from '../../components/Connection';
import { MenuItem } from "../../components/DbTypes";
import { createJsonStream } from '../../components/JsonStream';

export default async function handler(_req: NextApiRequest, res: NextApiResponse<MenuItem[]>) {
  const items = MenuItemModel.find().cursor();
  await pipeline(items, createJsonStream(), res);
}
