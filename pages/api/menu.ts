// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connect } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { pipeline } from 'stream/promises';
import { connectionString, MenuItemModel } from '../../lib/Connection';
import { MenuItem } from "../../lib/DbTypes";
import { createJsonStream } from '../../lib/JsonStream';

export default async function handler(_req: NextApiRequest, res: NextApiResponse<MenuItem[]>) {
  await connect(connectionString);
  const items = MenuItemModel.find().cursor();
  await pipeline(items, createJsonStream(), res);
}
