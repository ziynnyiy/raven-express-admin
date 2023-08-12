import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "GET") {
    res.json(await Admin.find());
  }

  if (req.method === "POST") {
    const { email } = req.body;
    if (await Admin.findOne({ email })) {
      res.status(400).json({ message: "管理員已經存在!" });
    } else {
      res.json(await Admin.create({ email }));
    }
  }

  if (req.method === "DELETE") {
    const { _id } = req.query;
    res.json(await Admin.findByIdAndDelete(_id));
  }
}
