import db from "../config/db.js";

export const submitForm = (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name And Email are required" });
    }

    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";

    db.query(sql, [name, email], (err, result) => {
        if(err) {
            console.log("Insert Error:", err.message);
            return res.status(500).json({ message: "Database Error" });
        }
        res.status(201).json({
            message: "Form Submitted Successfully",
            data: { id: result.insertId, name, email },
        });
    });
}