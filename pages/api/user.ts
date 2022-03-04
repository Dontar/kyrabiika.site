import { getSession } from "next-auth/react";
import bcrypt from "bcrypt";

import rest from "../../lib/utils/rest";
import { UserModel } from "../../lib/db/Connection";
import { LoggedInUser } from "../../lib/db/DbTypes";
import { resetPassProps } from "../../lib/types/next-auth";

const handler = rest();

type Mail = { userMail?: string; message?: string; }

handler.withSession.get<Partial<LoggedInUser>>(async (req, res) => {
  const session = await getSession({ req });
  // console.log("In User.tx", session);
  if (session !== null) {
    const user = await UserModel
      .findOne({ mail: session?.user.email ?? "" })
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
  const mail = req.session?.user.email;
  let userData = req.body;
  if (userData.mail !== mail) {
    return res.status(401).json({ isLoggedIn: false } as LoggedInUser);
  }
  if (userData.hasOwnProperty("password") && userData.password !== "") {
    userData.password = await bcrypt.hash(userData.password!, process.env.DB_SALT_ROUNDS || 9);
  } else {
    let { password: _, ...rest } = userData;
    userData = rest;
  }
  const user = await UserModel.findOneAndUpdate({ mail: mail || "" }, userData, { new: true }).lean();
  if (user) {
    res.json({ ...user, isLoggedIn: true });
  } else {
    res.status(401).json({ isLoggedIn: false } as LoggedInUser);
  }
});

handler.withAuth.put<Mail>(async (req, res) => {
  const { mail, newPass, } = (req.body ?? {}) as resetPassProps;
  if (!!mail && !!newPass) {
    let password = await bcrypt.hash(newPass, process.env.DB_SALT_ROUNDS || 9);
    const user = await UserModel.findOneAndUpdate({ mail: mail || "" }, { password }).lean();
    if (user) {
      res.json({ userMail: user.mail });
    } else {
      res.status(403).json({ message: "The password was not changed, please try again later." });
    }
  } else {
    res.status(403).json({ message: "Something went wrong, please try again later!" });
  }
});

export default handler;

// handler.withSession.get<Partial<LoggedInUser>>(async (req, res) => {
//   const session: mySession | null = await getSession({ req });
//   const { id } = session!.user!;
//   if (id) {
//     const user = await UserModel
//       .findById(id)
//       .select("-password -roles")
//       .lean();

//     if (user) {
//       res.json({ ...user, isLoggedIn: true });
//       return;
//     }
//   }
//   res.json({ isLoggedIn: false });
// });
