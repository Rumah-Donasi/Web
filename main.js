const { pool, checkDB } = require('./database/db.js');
const { authUser, authLembaga, authAdmin } = require('./auth/auth.js');
const {
  rootRouter,
  loginAdminRouter,
  loginLembagaRouter,
  registerLembagaRouter,
  loginUserRouter,
  registerUserRouter,
  userRouter,
  lembagaRouter,
  adminRouter,
} = require('./routes/mainRouter.js');

const express = require('express');
const session = require('express-session');

checkDB();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use("/", rootRouter);

app.use('/login/admin', loginAdminRouter);
app.use('/login/lembaga', loginLembagaRouter);
app.use('/register/lembaga', registerLembagaRouter);
app.use('/login/user', loginUserRouter);
app.use('/register/user', registerUserRouter);

app.use('/admin', authAdmin, adminRouter);
app.use('/lembaga', authLembaga, lembagaRouter);
app.use('/user', authUser, userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});