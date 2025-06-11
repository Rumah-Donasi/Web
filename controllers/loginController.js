
const db = require('../config/db');
const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");
require('dotenv').config();

// REGISTER
const register = (usertype) => {
    return async (req, res) => {
        try {
            const { username, password, email, confirm_password } = req.body;

            if(!username){
                return res.render('pages/logres', {
                    password,
                    email,
                    confirm_password,
                    err: {
                        username: "Mohon lengkapi username"
                    }
                });
            }

            if(!password){
                return res.render('pages/logres', {
                    username,
                    email,
                    confirm_password,
                    err: {
                        password: "Mohon lengkapi password"
                    }
                });
            }

            if(!email){
                return res.render('pages/logres', {
                    username,
                    password,
                    confirm_password,
                    err: {
                        email: "Mohon lengkapi email"
                    }
                });
            }

            if(!confirm_password){
                return res.render('pages/logres', {
                    username,
                    password,
                    email,
                    err: {
                        confirm_password: "Mohon konfirmasi password"
                    }
                });
            }

            if (password !== confirm_password) {
                return res.render('pages/logres', {
                    username,
                    password,
                    email,
                    confirm_password,
                    err: {
                        confirm_password: "Password tidak cocok"
                    }
                });
            }

            if (!['user', 'lembaga'].includes(usertype)) {
                return res.render('pages/error', {
                    error: "Tipe user tidak valid (user atau lembaga)"
                });
            }

            const existing = await db.query(
                'SELECT id_user FROM users WHERE username = $1',
                [username]
            );
            if (existing.rows.length > 0) {
                return res.render('pages/logres', {
                    username,
                    password,
                    email,
                    confirm_password,
                    err: {
                        username: "Username sudah digunakan"
                    }
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = `
                INSERT INTO users (username, email, passwd, usertype, verifikasi)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id_user, username, email, usertype, verifikasi;
            `;

            const result = await db.query(insertQuery, [
                username,
                email,
                hashedPassword,
                usertype,
                usertype === 'lembaga' ? false : true
            ]);

            const user = result.rows[0];

            const token = JWT.sign(
                { id: user.id_user, usertype: user.usertype, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            delete user.password;
            delete user.confirm_password;

            if (usertype === 'lembaga') {
                return res.redirect('/lembaga');
            }
            res.redirect('/');
        } catch (err) {
            return res.render('pages/error.ejs', {
            error: err
        });
        }
    };
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.render('pages/logres', {
                password,
                err: {
                    username: "Mohon lengkapi username",
                }
            });
        }

        if (!password) {
            return res.render('pages/logres', {
                username,
                err: {
                    password: "Mohon lengkapi password",
                }
            });
        }

        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.render('pages/logres', {
                username,
                password,
                err: {
                    username: "Username tidak ditemukan",
                }
            })
        }

        const user = result.rows[0];

        if (user.usertype === 'lembaga' && !user.verifikasi) {
            return res.render('pages/error', {
                error: "Akun lembaga belum diverifikasi oleh admin"
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwd);

        if (!isMatch) {
            return res.render('pages/logres', {
                username: username,
                password: password,
                err: {
                    password: "Password salah",
                }
            })
        }

        const token = JWT.sign(
            { id: user.id_user, usertype: user.usertype, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        delete user.password;

        if (user.usertype === 'lembaga') {
            return res.redirect('/lembaga');
        }
        return res.redirect('/');
    } catch (err) {
        return res.render('pages/error', {
            error: err
        });
    }
};

const aquery = 'select * from admins where username = $1 and passwd = $2 limit 1'

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      aquery, [username, password]
    );
    if (result.rows.length > 0) {
      req.session.role = 'admin';
      req.session.username = username;
      res.redirect('/admin');
    } else {
      res.redirect('/private/adminlogin.html');
    }
  } catch (error) {
    console.error('DB query error:', error);
    res.status(500).send('Internal server error');
  }
}

module.exports = { 
    register,
    login
};


