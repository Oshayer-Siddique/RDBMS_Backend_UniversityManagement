const db = require("../Config/db");

const loginUser = async (req, res) => {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
        return res.status(400).json({ message: "Please provide role, email, and password." });
    }

    try {
        let query;
        let params;

        if (role === "admin") {
            if (email === "admin@gmail.com" && password === "admin123") {
                return res.status(200).json({
                    message: "Login successful",
                    user: {
                        user_id: "admin",
                        user_role: "admin"
                    }
                });
            } else {
                return res.status(401).json({ message: "Invalid admin credentials." });
            }
        } else if (role === "student") {
            query = "SELECT student_id, password FROM student WHERE email = ?";
            params = [email];
        } else if (role === "teacher") {
            query = "SELECT teacher_id, password FROM teacher WHERE email = ?";
            params = [email];
        } else {
            return res.status(400).json({ message: "Invalid role." });
        }

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Internal Server Error" });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid email or password." });
            }

            const user = results[0];

            if (user.password !== password) {
                return res.status(401).json({ message: "Invalid email or password." });
            }

            const user_id = role === "student" ? user.student_id : user.teacher_id;

            return res.status(200).json({
                message: "Login successful",
                user: {
                    user_id: user_id,
                    user_role: role
                }
            });
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { loginUser };