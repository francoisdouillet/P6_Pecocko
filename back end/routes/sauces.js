const express = require("express");
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

const auth = require('../middleware/auth')

const multer = require('../middleware/multer-config')

router.post('/', auth, multer, saucesCtrl.createOneSauce);

router.get('/', auth, saucesCtrl.getAllSauce);  

router.get('/:id', auth, saucesCtrl.getOneSauce);   

router.put('/:id', auth, multer, saucesCtrl.modifyOneSauce);

router.delete('/:id', auth, saucesCtrl.deleteOneSauce);



module.exports = router;