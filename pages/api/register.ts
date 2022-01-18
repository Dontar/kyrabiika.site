import bcrypt from "bcrypt";
import { db, UserModel } from "../../lib/db/Connection";
import rest from "../../lib/utils/rest";

const handler = rest();

handler.use(db);

handler.withSession.post(async (req, res) => {
  const registerInfo = req.body ?? {};
  const user = await UserModel.findOne({ mail: registerInfo?.mail });

  if (user === null) {
    const { name, mail, password: rawPassword } = registerInfo;
    const [firstName, lastName] = String(name ?? "").split(" ");
    const password = await bcrypt.hash(rawPassword, process.env.DB_SALT_ROUNDS || 9);

    const user = new UserModel({
      firstName,
      lastName,
      mail,
      password
    });
    await user.save();

    req.session.user = user._id.toString();
    await req.session.save();
    res.json({...user.toObject(), isLoggedIn: true, password: undefined});
  } else {
    res.status(403).json({ message: "User already exists." });
  }
});

export default handler;
