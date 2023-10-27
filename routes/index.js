const express = require('express');
const router = express.Router();


router.use('/',require('./home'));
router.use('/reset', require('./reset'));


module.exports = router;