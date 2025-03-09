import db from "../config/db/index.js";

const UniAdmin = {
    // Check if a user is a UniAdmin
    async isUniAdmin(userId) {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM uni_admins WHERE user_id = ?",
                [userId],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results.length > 0); // Returns true if the user is an admin
                }
            );
        });
    }
};

export default UniAdmin;
