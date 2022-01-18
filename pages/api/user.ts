import rest from "../../lib/utils/rest";
import { UserModel } from "../../lib/db/Connection";

const handler = rest();

handler.withSession.get(async (req, res) => {
  if (req.session.user) {
    const user = await UserModel
      .findById(req.session.user)
      .select("-password -roles")
      .lean();

    res.json({ ...user, isLoggedIn: true });
  } else {
    res.json({ isLoggedIn: false });
  }
});

export default handler;
