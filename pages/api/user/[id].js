import { MD5 } from "crypto-js";
import { conn } from "../../../utils/db";
import NextCors from "nextjs-cors";

async function update(req, res) {
  const { id } = req.query;
  let { type_user, nama, telepon, alamat, username, password } = req.body;
  if (password === "" || !password) {
    password = await conn
      .promise()
      .query("SELECT password FROM user WHERE id_user = ?", [id])
      .then(([rows]) => rows[0].password);
  } else {
    password = MD5(password).toString();
  }
  conn.query(
    "UPDATE user SET type_user = ?, nama = ?, telepon = ?, alamat = ?, username = ?, password = ? WHERE id_user = ?",
    [type_user, nama, telepon, alamat, username, password, id],
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
  conn.query("DELETE FROM user WHERE id_user = ?", [id], (err, result) => {
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

function get(req, res) {
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
    case "GET":
      get(req, res);
  }
}
