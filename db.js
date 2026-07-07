import mysql from "mysql2/promise";

//create connection - connection + connect
const conn = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "coding_savvy",
});

console.log("Database sucessfully connected");

export default conn;
