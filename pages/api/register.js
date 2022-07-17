import { conn, fieldCheck } from "../../utils/db";
import { MD5 } from "crypto-js";
import NextCors from "nextjs-cors";

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  let { nama, type_user, username, password, alamat, telepon } = req.body;
  type_user = type_user === null ? "kasir" : type_user;
  const usernameCheck = await fieldCheck("user", "username", username);
  const phoneCheck = await fieldCheck("user", "telepon", telepon);
  if (usernameCheck) {
    res
      .status(400)
      .json({ status: 400, response: "Username sudah digunakan." });
  } else if (phoneCheck) {
    res
      .status(400)
      .json({ status: 400, response: "Nomor HP sudah digunakan." });
  } else {
    conn.query(
      "INSERT INTO user (type_user, nama, username, password, alamat, telepon) VALUES (?, ?, ?, ?, ?, ?)",
      [type_user, nama, username, MD5(password).toString(), alamat, telepon],
      (err, result) => {
        if (err) {
          res.status(400).json({ status: 400, response: err.message });
        } else {
          if (result.insertId > 0) {
            res.status(200).json({ status: 200, response: result.insertId });
          } else {
            res.status(400).json({
              status: 400,
              response: "Register gagal. Periksa internet anda.",
            });
          }
        }
      }
    );
  }
}
