const db = require('../config/db');
const JWT = require("jsonwebtoken");
require('dotenv').config();

const authorize = (...allowedUserTypes) => {
    return (req, res, next) => {
        try {
            const token = req.cookies.token;
            JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ success: false, message: "Token tidak valid" });
                }

                if (!allowedUserTypes.includes(decoded.usertype)) {
                    console.log(decoded.usertype, allowedUserTypes);
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

const checkNotUsertype = (...notAllowedUserTypes) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            const token = req.cookies.token;
            
            if (!token){
                res.locals.user = null;
                return next(); 
            } 

            if (notAllowedUserTypes.includes(user.usertype)) {
                return res.render('pages/error', {
                    error: `Akses ditolak: ${notAllowedUserTypes.join('/')} tidak boleh mengakses halaman ini`
                });
            }
            next();
        } catch (error) {
            return res.render("pages/error.ejs", { error });
        }
    };
};

const cekLogin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token){
            res.locals.user = null;
            return next(); 
        } 

        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(); 
            }

            req.user = {
                id: decoded.id,
                usertype: decoded.usertype,
                username: decoded.username
            };

            res.locals.user = req.user;

            next();
        });
    } catch (error) {
        return res.render("pages/error.ejs", { error });
    }
};

const getInfoAkun = (req, res, next) => {
    try {
        const id = req.user.id;

        db.query(`SELECT * FROM users WHERE id_user = $1`, [id], (err, result) => {
            if (err) {
                return res.render("pages/error.ejs", { error: err });
            }

            res.locals.user = result.rows[0];
            next();
        });
    } catch (error) {
        return res.render("pages/error.ejs", { error });
    }
};

module.exports = { authorize, cekLogin, getInfoAkun, checkNotUsertype };
