import { conn } from "../../utils/db";
import NextCors from "nextjs-cors";

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const { from, to } = req.query;
  conn.query(
    "SELECT tgl_transaksi, SUM(total_bayar) as income FROM transaksi WHERE tgl_transaksi BETWEEN ? AND ? GROUP BY tgl_transaksi",
    [from, to],
    (err, result) => {
      if (err) {
        res.status(400).json({ status: 400, response: err.message });
      } else {
        res.status(200).json({ status: 200, response: result });
      }
    }
  );
}
