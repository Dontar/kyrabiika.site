// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import send from "send";
import { pipeline } from "stream/promises";
import { join } from "path";
import { imagesRootPath } from "../../../lib/utils/session";
import rest from "../../../lib/utils/rest";

const handler = rest();

handler.get((req, res) => {
  const { name } = req.query;
  const stream = send(req, join(...name as string[]), { root: imagesRootPath });
  return pipeline(stream as unknown as NodeJS.ReadableStream, res);
});

export default handler;
