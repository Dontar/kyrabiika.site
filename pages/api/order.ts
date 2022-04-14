
import rest from "../../lib/utils/rest";
import { OrderModel, UserModel } from "../../lib/db/Connection";
import { Order } from "../../lib/db/DbTypes";

const handler = rest();

handler.withAuth.get(async (req, res) => {
  const mail = req.session?.user.email;
  if (mail !== null) {
    const user = await UserModel
      .findOne({ mail: mail }, { _id: false })
      .select("orders")
      .lean({ autopopulate: true });
    if (user) {
      res.json(user.orders);
      return;
    }
  }
  res.json([]);
});

handler.withAuth.post(async (req, res) => {
  const mail = req.session?.user.email;
  const order = req.body as Order;
  const result = await (new OrderModel(order)).save();
  const user = await UserModel.updateOne({ mail: mail || "" }, { $push: { orders: result._id } }, { new: true }).lean();

  if (result._id !== null && user.modifiedCount === 1) {
    res.json({ id: result._id, message: "The order was sent successfully." });
  } else {
    res.status(403).json({ message: "The order was not sent, please try again later!" });
  }
});



export default handler;

