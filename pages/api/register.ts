import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcrypt";
import { LogInUser, sessionOptions } from "../../lib/utils/session";
import { db, UserModel } from "../../lib/db/Connection";
import rest from "../../lib/utils/rest";

const handler = rest();

handler.use(db);

handler.get(async (req, res) => {
  const registerInfo = req.body;
  const user = await UserModel.findOne({ mail: registerInfo?.mail });

  if (user === null) {
    const { mail, password } = registerInfo;
    const salt = process.env.DB_SALT_ROUNDS || 9;
    const hashed = await bcrypt.hash(password, salt);
    const newUser = await UserModel.insertMany([{ mail, password: hashed }]);
    const { mail: m, orders, } = newUser[0];
    const user: LogInUser = { isLoggedIn: true, user: m, orders };
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } else {
    throw "The user has already existed";
  }

  try {


  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error });
  }
});

export default withIronSessionApiRoute(handler, sessionOptions);
