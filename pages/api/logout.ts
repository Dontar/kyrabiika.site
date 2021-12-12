import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import type { LogInUser } from './user'

export default withIronSessionApiRoute(logoutRoute, sessionOptions)

function logoutRoute(req: NextApiRequest, res: NextApiResponse<LogInUser>) {
  req.session.destroy()
  res.json({ isLoggedIn: false, user: '', orders: [], })
}
