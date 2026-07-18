import mysql2 from "mysql2/promise";

const config = {
  host: "localhost",
  user: "test_user",
  password: "test123",
  database: "coding_savvy",
};

const conn = await mysql2.createConnection(config);

console.log("Databse connected!");


export default conn;
