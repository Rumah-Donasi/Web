exports.getView = (req, res) => {
  res.send('Register page');
};
//query pgsql
const uquery='insert into users ()values'
const lquery='insert into lembaga(username,passwd,nama_lembaga) values'
// continue this
exports.postRegister = (req, res) => {
  const { code } = req.body;
  if (code === 1) {//user register
    
    console.log('Received code 1');
  }else if (code === 2) {//lembaga register

    console.log('Received code 2');
  }else {
    res.status(400)
    console.log('Invalid code');
  }
};