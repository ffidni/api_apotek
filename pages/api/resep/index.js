import { conn, fieldCheck } from "../../../utils/db";
import NextCors from "nextjs-cors";

function get(req, res) {
  conn.query("SELECT * FROM resep", (err, result) => {
    if (err) res.status(400).json({ status: 400, response: err.message });
    else {
      res.status(200).json({ status: 200, response: result });
    }
  });
}

async function post(req, res) {
  const {
    no_resep,
    nama_dokter,
    nama_pasien,
    nama_obatdibeli,
    jumlah_obatdibeli,
    id_pasien,
  } = req.body;
  const nomorCheck = await fieldCheck("resep", "no_resep", no_resep);
  if (nomorCheck) {
    res.status(400).json({
      status: 400,
      response: "Nomor resep sudah terdaftar. Gunakan yang lain",
    });
  } else {
    conn.query(
      "INSERT INTO resep (no_resep, nama_dokter, nama_pasien, nama_obatdibeli, jumlah_obatdibeli, id_pasien) VALUES (?, ?, ?, ?, ?, ?)",
      [
        no_resep,
        nama_dokter,
        nama_pasien,
        nama_obatdibeli,
        jumlah_obatdibeli,
        id_pasien,
      ],
      (err, result) => {
        if (err) res.status(400).json({ status: 400, response: err.message });
        else {
          if (result.insertId > 0) {
            res
              .status(200)
              .json({ status: 200, response: "Berhasil ditambahkan." });
          } else {
            res.status(400).json({
              status: 400,
              response: "Tambah gagal. Periksa internet anda.",
            });
          }
        }
      }
    );
  }
}

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    case "POST":
      post(req, res);
      break;
  }
}
