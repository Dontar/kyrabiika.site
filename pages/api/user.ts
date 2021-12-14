import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/utils/session";
import rest from "../../lib/utils/rest";

const handler = rest();

handler.get((req, res) => {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      user: "",
      orders: [],
    });
  }
});

export default withIronSessionApiRoute(handler, sessionOptions);
