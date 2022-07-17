import { MD5 } from "crypto-js";
import { conn } from "../../utils/db";
import NextCors from "nextjs-cors";

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  const { username, password } = req.body;
  conn.query(
    "SELECT * FROM user WHERE username = ? AND password = ?",
    [username, MD5(password).toString()],
    (err, result) => {
      if (err) res.status(400).json({ status: 400, response: err.message });
      else {
        if (result.length > 0) {
          res.status(200).json({ status: 200, response: result[0] });
        } else {
          res
            .status(400)
            .json({ status: 400, response: "Username atau kata sandi salah." });
        }
      }
    }
  );
}
