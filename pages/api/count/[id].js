import NextCors from "nextjs-cors";
import { conn } from "../../../utils/db";

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  const { id } = req.query;

  conn.query(`SELECT COUNT(*) FROM ${id}`, (err, result) => {
    if (err) return res.status(400).json({ status: 400, response: err });
    return res
      .status(400)
      .json({ status: 200, response: result[0]["COUNT(*)"] });
  });
}
