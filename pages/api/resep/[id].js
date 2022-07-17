import { conn } from "../../../utils/db";
import NextCors from "nextjs-cors";

async function update(req, res) {
  const { id } = req.query;
  const {
    no_resep,
    tgl_resep,
    nama_dokter,
    nama_pasien,
    nama_obatdibeli,
    jumlah_obatdibeli,
    id_pasien,
  } = req.body;

  conn.query(
    "UPDATE resep SET no_resep = ?, tgl_resep = ?, nama_dokter = ?, nama_pasien = ?, nama_obatdibeli = ?, jumlah_obatdibeli = ? WHERE id_resep = ?",
    [
      no_resep,
      tgl_resep,
      nama_dokter,
      nama_pasien,
      nama_obatdibeli,
      jumlah_obatdibeli,
      id_pasien,
      id,
    ],
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
  conn.query("DELETE FROM resep WHERE id_resep = ?", [id], (err, result) => {
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

function get(res) {
  const { id } = req.query;
  conn.query("SELECT * FROM user WHERE id = ?", [id], (err, result) => {
    if (err) res.status(400).json({ status: 400, response: err.message });
    else {
      res.status(200).json({ status: 200, response: result[0] });
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
