import { conn } from "../../../utils/db";
import NextCors from "nextjs-cors";

function post(req, res) {
  const { no_transaksi, total_bayar, id_user, id_obat, id_resep } = req.body;
  conn.query(
    "INSERT INTO transaksi (no_transaksi, total_bayar, id_user, id_obat, id_resep) VALUES (?, ?, ?, ?, ?)",
    [no_transaksi, total_bayar, id_user, id_obat, id_resep],
    (err, result) => {
      if (err) {
        res.status(400).json({ status: 400, response: err.message });
      } else {
        if (result.insertId > 0) {
          res
            .status(200)
            .json({ status: 200, response: "Transaksi berhasil." });
        } else {
          res.status(400).json({
            status: 400,
            response: "Transaksi gagal. Periksa internet anda.",
          });
        }
      }
    }
  );
}

function get(req, res) {
  conn.query(
    "SELECT tgl_transaksi, SUM(total_bayar) as income FROM transaksi GROUP BY tgl_transaksi",
    (err, result) => {
      if (err) {
        res.status(400).json({ status: 400, response: err.message });
      } else {
        res.status(200).json({ status: 200, response: result });
      }
    }
  );
}

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  switch (req.method) {
    case "POST":
      post(req, res);
      break;
    case "GET":
      get(req, res);
      break;
  }
}
