exports.getView = (req, res) => {
  res.send('Register page');
};

exports.postRegister = (req, res) => {
  const { code } = req.body;
  if (code === 1) {//user login
    
    console.log('Received code 1');
  }else if (code === 2) {//lembaga login

    console.log('Received code 2');
  }else {
    res.status(400)
    console.log('Invalid code');
  }
};