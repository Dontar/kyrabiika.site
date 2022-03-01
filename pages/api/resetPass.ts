import { randomUUID } from "crypto";
import path from "path";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import rest from "../../lib/utils/rest";
import { db, UserModel, RandomTokenModel } from "../../lib/db/Connection";
import { LoggedInUser } from "../../lib/db/DbTypes";
import { resetPassProps } from "../../lib/types/next-auth";

const handler = rest();

handler.use(db);

handler.withSession.get(async (req, res) => {
  const { code: token } = req.query;
  const record = await RandomTokenModel.findOne({ token });
  if (record !== null) {
    res.json({ userMail: record.mail });
  } else {
    res.status(403).json({ message: "The link is not valid anymore, please request a new one!" });
  }

});

handler.withSession.post(async (req, res) => {
  const { mail } = req.body as Partial<LoggedInUser>;
  if (mail === undefined) {
    res.status(403).json({ message: "Internal app error, please try again later!" });
  }

  const user = await UserModel.findOne({ mail: mail || "" }).lean();
  if (user !== null) {
    let uuid = randomUUID();
    const result = await RandomTokenModel.updateOne({ mail }, { mail, token: uuid }, { upsert: true }).lean();
    if (result.acknowledged !== true) {
      res.status(503).json({ message: "service temporarily unavailable please try again later" });
      return;
    }

    setTimeout(async () => {
      await RandomTokenModel.deleteOne({ mail });
    }, 3600000);

    await main(mail!, uuid)
      .then(() => {
        res.json({ message: "The reset password link was sent. Please check your Inbox along with the SPAM folder!" });
      })
      .catch((error) => {
        console.log("Send email error: " + error.response);
        res.status(550).json({ message: "Server error, please try again later!" });
      });
  } else {
    res.status(403).json({ message: "The email has not been found" });
  }

});

handler.withSession.put(async (req, res) => {
  const { mail, newPass, token } = (req.body ?? {}) as resetPassProps;
  const record = await RandomTokenModel.findOne({ mail, token });
  if (record !== null) {
    let password = await bcrypt.hash(newPass, process.env.DB_SALT_ROUNDS || 9);
    const user = await UserModel.findOneAndUpdate({ mail: mail || "" }, { password }).lean();
    if (user) {
      res.json({ userMail: user.mail });
      await RandomTokenModel.deleteOne({ mail });
    } else {
      res.status(403).json({ message: "The password was not changed, please try again later." });
    }
  } else {
    res.status(403).json({ message: "The link is not valid anymore, please request a new one!" });
  }
});

async function main(mail: string, uuid: string) {
  let transporter = await nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    service: "yahoo",
    name: "kyrabiika",
    secure: true, // true for 465, false for other ports
    auth: {
      user: "kyrabiika@yahoo.com",
      pass: "yifbczbblcfhrlrv"
    },
    // tls: {
    //   // do not fail on invalid certs
    //   rejectUnauthorized: false
    // },
    // debug: false,
    // logger: true
  });
  // let transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: "myrtle.rosenbaum26@ethereal.email",
  //     pass: "59tSxp6rmrzrUUq4WJ"
  //   },
  // });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages", success);
    }
  });

  let message = {
    from: {
      name: "КуРабиЙка офис",
      address: "kyrabiika@yahoo.com"
    },
    to: `${mail}`,
    subject: "It is a reset link for Kyrabiika site ✔ " + new Date().toLocaleString("en-GB", { timeZone: "EET" }),

    html: `<img src="cid:logo@kyrabiika.site"/>
        <p><img src="cid:accept@kyrabiika.site"/>&nbsp&nbsp<b>Hello</b> Dear customer, </p>
        <p>Here's a reset password link which is valid for 10 min.</p>
        <br/>
        <a>${process.env.NEXTAUTH_URL}/reset?code=${uuid}</a>`,

    attachments: [
      {
        filename: "image.png",
        content: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/" +
          "//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U" +
          "g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC",
          "base64"
        ),
        cid: "accept@kyrabiika.site" // should be as unique as possible
      },
      {
        filename: "kyrabiikasite.png",
        path: path.join(process.cwd(), "images/kyrabiikasite.png"),
        cid: "logo@kyrabiika.site" // should be as unique as possible
      }
    ],
  };

  let info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  return info;
}

export default handler;
