import rest from "../../lib/utils/rest";
import { UserModel } from "../../lib/db/Connection";
import { LoggedInUser } from "../../lib/db/DbTypes";

const handler = rest();

handler.withSession.get<Partial<LoggedInUser>>(async (req, res) => {
  if (req.session.user) {
    const user = await UserModel
      .findById(req.session.user)
      .select("-password -roles")
      .lean();

    if (user) {
      res.json({ ...user, isLoggedIn: true });
      return;
    }
  }
  res.json({ isLoggedIn: false });
});

handler.withAuth.post<LoggedInUser>(async (req, res) => {
  const id = req.session.user;
  const userData = req.body;
  const user = await UserModel.findByIdAndUpdate(id, userData).lean();
  if (user) {
    res.json({ ...user, isLoggedIn: true });
  } else {
    res.status(401).json({ isLoggedIn: false } as LoggedInUser);
  }
});

export default handler;
