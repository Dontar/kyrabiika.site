import rest from "../../lib/utils/rest";

const handler = rest();

handler.withSession.get(async (req, res) => {
  req.session.destroy();
  res.json({ isLoggedIn: false });
});

export default handler;

