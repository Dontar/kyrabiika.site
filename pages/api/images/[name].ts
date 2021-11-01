// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import send from 'send';
import { pipeline } from 'stream/promises';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query
  const stream = send(req, `/${name as string}/thumb.jpg`, { root: '/workspaces/kyrabiika.site/images' });
  return pipeline(stream as unknown as NodeJS.ReadableStream, res);
}
