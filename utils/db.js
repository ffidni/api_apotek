const mysql = require("mysql2");

export const conn = mysql.createPool({
  host: "plato-db.id.domainesia.com",
  database: "nurasico_apotek",
  user: "nurasico_apotek",
  password: "Defunctionpython23",
  waitForConnections: true,

  // host: "localhost",
  // database: "apotek",
  // user: "root",
  // password: "",
  // waitForConnections: true,
});

export async function fieldCheck(table, field, value) {
  return await conn
    .promise()
    .query(`SELECT * FROM ${table} WHERE ${field} = ? `, [value])
    .then(([rows]) => rows.length > 0)
    .catch((_) => "error");
}
