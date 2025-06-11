// pool untuk koneksi ke database
const { pool, checkDB } = require('./database/db.js');

//auth untuk cek session apakah sudah login atau belum
const { authUser, authLembaga, authAdmin } = require('./auth/auth.js');
const {
  rootRouter,
  loginRouter,
  registerLembagaRouter,
  registerUserRouter,
  userRouter,
  lembagaRouter,
  adminRouter,
} = require('./routers/mainRouter.js');

const express = require('express');
const session = require('express-session');
const { adminLogin } = require('./controllers/loginController.js');

checkDB(); //check apakah database sudah terhubung
const app = express();
const port = 3000;

//middleware untuk bisa baca body berupa json dan form. 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware untuk session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
  })
);
app.use('/private', express.static(__dirname + '/private'));

app.use("/", rootRouter);
app.post('/loginadmin',adminLogin);
app.use('/login', loginRouter);
app.use('/register/lembaga', registerLembagaRouter);
app.use('/register/user', registerUserRouter);

app.use('/admin', authAdmin, adminRouter);
app.use('/lembaga', authLembaga, lembagaRouter);
app.use('/user', authUser, userRouter);

app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});