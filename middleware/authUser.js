const JWT = require("jsonwebtoken");

const authorize = (...allowedUserTypes) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
            }

            const token = authHeader.split(" ")[1];
            JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ success: false, message: "Token tidak valid" });
                }

                if (!allowedUserTypes.includes(decoded.usertype)) {
                    return res.status(403).json({
                        success: false,
                        message: `Akses ditolak: hanya ${allowedUserTypes.join('/')} yang diizinkan`
                    });
                }

                req.user = {
                    id: decoded.id,
                    usertype: decoded.usertype
                };

                next();
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    };
};

module.exports = authorize;
