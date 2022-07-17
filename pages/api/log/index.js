import { conn } from "../../../utils/db";
import NextCors from "nextjs-cors";

function get(req, res) {
  conn.query("SELECT * FROM log", (err, result) => {
    if (err) res.status(400).json({ status: 400, response: err.message });
    else {
      res.status(200).json({ status: 200, response: result });
    }
  });
}

async function post(req, res) {
  const { waktu, aktifitas, id_user } = req.body;
  conn.query(
    "INSERT INTO log (waktu, aktifitas, id_user) VALUES (?, ?, ?)",
    [waktu, aktifitas, id_user],
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
