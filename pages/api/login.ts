import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcrypt";

import { LogInUser, sessionOptions } from "../../lib/utils/session";
import { db, UserModel } from "../../lib/db/Connection";
import rest from "../../lib/utils/rest";

const handler = rest();

handler.use(db);

handler.get(async (req, res) => {
  const loginInfo = await req.body;

  const user = await UserModel.findOne({ mail: loginInfo?.mail });

  if (user !== null) {
    const { orders, mail, password } = user;
    const isMatched = await bcrypt.compare(loginInfo?.password, password);

    if (isMatched) {
      const user: LogInUser = { isLoggedIn: true, user: mail, orders };
      req.session.user = user;
      await req.session.save();
      res.json(user);
      return;
    }
  }
  res.status(404).json({ message: "Wrong user or password" });
});

export default withIronSessionApiRoute(handler, sessionOptions);
