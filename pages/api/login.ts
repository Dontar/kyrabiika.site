import bcrypt from "bcrypt";

import { db, UserModel } from "../../lib/db/Connection";
import { LoggedInUser } from "../../lib/db/DbTypes";
import rest from "../../lib/utils/rest";

const handler = rest();

handler.use(db);

handler.withSession.post<LoggedInUser>(async (req, res) => {
  const loginInfo = req.body;

  const user = await UserModel.findOne({ mail: loginInfo.mail }).lean();

  if (user !== null) {
    const isMatched = await bcrypt.compare(loginInfo.password!, user.password);

    if (isMatched) {
      req.session.user = user._id;
      await req.session.save();
      res.json({ ...user, password: undefined, roles: undefined, isLoggedIn: true });
      return;
    }
  }
  res.status(404).json({ message: "Wrong user or password" } as any);
});

export default handler;
