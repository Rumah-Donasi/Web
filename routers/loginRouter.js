const { getView, postLogin } = require('../controllers/loginController');
const express = require('express');
const router = express.Router();

router.get('/', getView);
router.post('/', (req, res, next) => {
    //placeholder for login logic
    const type=1;//1 for user, 2 for lembaga(placeholder)
    if (type === 1){
        req.body = {...req.body, code: 1 };
    }else if (type ===2){
        req.body = {...req.body, code: 2 };
    }
    next();
}, postLogin);
module.exports = router;