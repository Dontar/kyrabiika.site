import bcrypt from "bcrypt";
import { db, UserModel } from "../../lib/db/Connection";
import { LoggedInUser } from "../../lib/db/DbTypes";
import rest from "../../lib/utils/rest";

const handler = rest();

handler.use(db);

handler.withSession.post(async (req, res) => {
  const registerInfo = (req.body ?? {}) as LoggedInUser;
  const user = await UserModel.findOne({ mail: registerInfo.mail });

  if (user === null) {
    registerInfo.password = await bcrypt.hash(registerInfo.password!, process.env.DB_SALT_ROUNDS || 9);

    const user = await (new UserModel(registerInfo)).save();

    req.session.user = user._id.toString();
    await req.session.save();
    res.json({ ...user.toObject(), isLoggedIn: true, password: undefined });
  } else {
    res.status(403).json({ message: "User already exists." });
  }
});

export default handler;
