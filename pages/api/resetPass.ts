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

    main(mail!, uuid)
      .then(() => {
        res.json({ message: "The reset password link was sent. Please check your email" });
      })
      .catch(console.error);
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
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "myrtle.rosenbaum26@ethereal.email",
      pass: "59tSxp6rmrzrUUq4WJ"
    },
  });
  console.log(path.join(process.cwd(), 'images'));
  let message = {
    from: "'kyrabiika.site  '<admin@kyrabiika.site>",
    to: `${mail}`,
    subject: "It is a reset link for Kyrabiika site ✔ " + new Date().toLocaleString('en-GB', { timeZone: 'EET' }),

    html: `<p><b>Hello</b> Dear customer, <img src="cid:note@example.com"/></p>
        <p>Here's a reset password link which is valid for 10 min.<br/><img src="cid:nyan@example.com"/></p>
        <a>${process.env.NEXTAUTH_URL}/reset?code=${uuid}</a>`,
    attachments: [
      // Binary Buffer attachment
      {
        filename: 'image.png',
        content: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
          '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
          'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
          'base64'
        ),
        cid: 'note@example.com' // should be as unique as possible
      },
      {
        filename: 'kyrabiikasite.png',
        path: path.join(process.cwd(), 'images/kyrabiikasite.png'),
        cid: 'nyan@example.com' // should be as unique as possible
      }
    ],

    list: {
      // List-Help: <mailto:admin@example.com?subject=help>
      help: 'admin@example.com?subject=help',

      // List-Unsubscribe: <http://example.com> (Comment)
      unsubscribe: [
        {
          url: 'http://example.com/unsubscribe',
          comment: 'A short note about this url'
        },
        'unsubscribe@example.com'
      ],

      // List-ID: "comment" <example.com>
      id: {
        url: 'mylist.example.com',
        comment: 'This is my awesome list'
      }
    }
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log('Error occurred');
      console.log(error.message);
      return process.exit(1);
    }
    console.log('Message sent successfully!');
    // Click the link after the console.log below and you can see the email and the generated reset pass link
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    // only needed when using pooled connections
    transporter.close();
  });
}

export default handler;
