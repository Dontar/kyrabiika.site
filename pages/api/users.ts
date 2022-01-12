// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { pipeline } from "stream/promises";
import { UserModel } from "../../lib/db/Connection";
import { createJsonStream } from "../../lib/utils/json-stream";
import rest from "../../lib/utils/rest";

const handler = rest();

handler.get(async (_req, res) => {
  const users = UserModel.find().cursor();
  await pipeline(users, createJsonStream(), res);
});

export default handler;
