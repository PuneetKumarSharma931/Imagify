const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: 'uploads/'});

const { generateImage, imageVariation } = require('../controllers/openaiController');

router.use(express.json());
router.use(express.urlencoded({extended: false}));


router.post('/generateimage', generateImage);
router.post('/imagevariation', upload.single("file"), imageVariation);

module.exports = router;