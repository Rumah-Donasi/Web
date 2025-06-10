const db = require('../config/db');
const JWT = require("jsonwebtoken");
var path = require('path');
require('dotenv').config();

const authorize = (...allowedUserTypes) => {
    return (req, res, next) => {
        try {
            const token = req.cookies.token;
            JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.redirect('/');
                }

                if (!allowedUserTypes.includes(decoded.usertype)) {
                    return res.render('pages/error', {
                        error: `Akses ditolak: Hanya ${allowedUserTypes.join('/')} yang boleh mengakses halaman ini`
                    });
                }

                req.user = {
                    id: decoded.id,
                    usertype: decoded.usertype
                };

                next();
            });
        } catch (error) {
            res.render("pages/error.ejs", { error });
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

const redirectIfLogin = (req, res, next) => {
    if (!res.locals.user) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = { authorize, cekLogin, getInfoAkun, checkNotUsertype, redirectIfLogin };
