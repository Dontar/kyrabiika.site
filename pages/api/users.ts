// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { pipeline } from "stream/promises";
import { UserModel } from "../../lib/db/Connection"
import { User } from "../../lib/db/DbTypes"
import { createJsonStream } from "../../lib/utils/json-stream";

export default async function handler( _req: NextApiRequest, res: NextApiResponse<User[]> ) {
  const users = UserModel.find().cursor();
  await pipeline(users, createJsonStream(), res);
}
