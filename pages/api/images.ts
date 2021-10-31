// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import send from 'send';
import { URL } from 'url';
import { pipeline } from 'stream/promises';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stream = send(req, (new URL(req.url!)).pathname, { root: '/workspaces/kyrabiika.site' });
  return pipeline(stream as unknown as NodeJS.ReadableStream, res);
}
