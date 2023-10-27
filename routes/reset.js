// reset route
const express = require('express');
const router = express.Router();
const resetController = require('../controllers/reset_controller');

router.get('/forgot', resetController.forgotGet);
router.post('/forgot', resetController.passwordReset);

router.get('/recover', resetController.resetPassPage);
router.post('/update', resetController.updatePassword);

module.exports = router;