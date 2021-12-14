import { withIronSessionApiRoute } from "iron-session/next";
import { LogInUser, sessionOptions } from "../../lib/utils/session";
import rest from "../../lib/utils/rest";

const handler = rest();

handler.get(async (req, res) => {
  req.session.destroy();
  res.json({ isLoggedIn: false, user: "", orders: [], });
});

export default withIronSessionApiRoute(handler, sessionOptions);

