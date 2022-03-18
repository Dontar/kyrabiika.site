import { randomUUID } from "crypto";

import rest from "../../lib/utils/rest";
import { UserModel } from "../../lib/db/Connection";
import { Address } from "../../lib/db/DbTypes";

const handler = rest();

handler.withAuth.post(async (req, res) => {
  let uuid = randomUUID();
  const mail = req.session?.user.email;
  let address = { id: uuid, ...req.body as Partial<Address> };
  const result = await UserModel.updateOne({ mail: mail || "" }, { $push: { address } }, { new: true }).lean();
  if (result.modifiedCount === 1) {
    res.json({ message: "The address was added successfully." });
  } else {
    res.status(403).json({ message: "The address was not added, please try again later!" });
  }
});

handler.withAuth.put(async (req, res) => {
  const mail = req.session?.user.email;
  let address = req.body as Partial<Address>;
  const result = await UserModel.updateOne(
    { mail: mail || "" },
    { $set: { "address.$[elem]": address } },
    { arrayFilters: [{ "elem.id": address.id }] }
  );
  if (result.modifiedCount === 1) {
    res.json({ message: "The address was edited successfully." });
  } else {
    res.status(403).json({ message: "The address was not changed, please try again later!" });
  }
});

handler.withAuth.delete(async (req, res) => {
  const mail = req.session?.user.email;
  let { id } = req.body as Partial<Address>;
  const result = await UserModel.updateOne(
    { mail: mail || "" },
    { $pull: { address: { id: id } } }
  );
  if (result.modifiedCount === 1) {
    res.json({ message: "The address was deleted successfully." });
  } else {
    res.status(403).json({ message: "The address was not deleted, please try again later!" });
  }
});

export default handler;

