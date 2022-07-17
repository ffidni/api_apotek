import { conn } from "../../../utils/db";
import NextCors from "nextjs-cors";

async function update(req, res) {
  const { id } = req.query;
  let { kode_obat, nama_obat, expired_date, jumlah, harga } = req.body;

  conn.query(
    "UPDATE obat SET kode_obat = ?, nama_obat = ?, expired_date = ?, jumlah = ?, harga = ? WHERE id_obat = ?",
    [kode_obat, nama_obat, expired_date, jumlah, harga, id],
    (err, result) => {
      if (err) res.status(400).json({ status: 400, response: err.message });
      else {
        if (result.affectedRows > 0) {
          res.status(200).json({ status: 200, response: "Berhasil diupdate." });
        } else {
          res.status(400).json({
            status: 400,
            response: "Update gagal. Periksa internet anda.",
          });
        }
      }
    }
  );
}

function del(req, res) {
  const { id } = req.query;
  conn.query("DELETE FROM obat WHERE id_obat = ?", [id], (err, result) => {
    if (err) res.status(400).json({ status: 400, response: err.message });
    else {
      if (result.affectedRows > 0) {
        res.status(200).json({ status: 200, response: "Berhasil dihapus." });
      } else {
        res.status(400).json({
          status: 400,
          response: "Menghapus gagal. Periksa internet anda.",
        });
      }
    }
  });
}

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  switch (req.method) {
    case "PUT":
      update(req, res);
      break;
    case "DELETE":
      del(req, res);
      break;
  }
}
