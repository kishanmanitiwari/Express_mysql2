import mysql2 from "mysql2/promise";
import { configDotenv } from "dotenv";

configDotenv({debug:true});

const config = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
};

const conn = await mysql2.createConnection(config);

console.log("Databse connected!");


export default conn;
