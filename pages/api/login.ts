
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcrypt";
import { sessionOptions } from "../../lib/session";
import type { LogInUser } from "./user";
import { connect, UserModel } from "../../lib/db/Connection";
import { User } from "../../lib/db/DbTypes";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const loginInfo = await req.body;

  try {
    await connect();
    const { mail, orders, password } = await UserModel.findOne({ mail: loginInfo?.mail }) as User;

    const isMatched = await bcrypt.compare(loginInfo?.password, password);
    if (!isMatched) {
        throw new Error();
    }

    const user: LogInUser = { isLoggedIn: true, user: mail, orders };
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: "Wrong user or password" });
  }
}
