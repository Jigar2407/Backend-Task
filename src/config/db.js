import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "6778@Jigar",
    database: "express_sql",
});

db.connect((err) => {
    if (err) {
        console.log("MYSQL Connection Error:", err.message);
    } else {
        console.log("MYSQL Connected");
    }
});

export default db;