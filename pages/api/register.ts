
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcrypt";
import { sessionOptions } from "../../lib/session";
import type { LogInUser } from "./user";
import { connect, UserModel } from "../../lib/db/Connection";
import { User } from "../../lib/db/DbTypes";

export default withIronSessionApiRoute(register, sessionOptions);

async function register(req: NextApiRequest, res: NextApiResponse) {
  const registerInfo = await req.body;

  try {
    await connect();
    const result = await UserModel.findOne({ mail: registerInfo?.mail }) as User;

    if (result === null) {
      const { mail, password } = registerInfo;
      const salt = process.env.db_saltRounds || 9;
      const hashed = await bcrypt.hash(password, salt);
      const newUser = await UserModel.insertMany([{ mail, password: hashed }]);
      const {mail: m, orders, } = newUser[0];
      const user: LogInUser = { isLoggedIn: true, user: m, orders };
      req.session.user = user;
      await req.session.save();
      res.json(user);
    } else {
      throw "The user has already existed";
    }

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error });
  }
}
