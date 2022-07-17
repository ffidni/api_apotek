import { conn } from "../../../utils/db";
import NextCors from "nextjs-cors";

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  conn.query(
    "SELECT * FROM log WHERE waktu LIKE ?",
    [`%${req.query.date}%`],
    (err, result) => {
      if (err) res.status(400).json({ status: 400, response: err.message });
      else {
        res.status(200).json({ status: 200, response: result });
      }
    }
  );
}
