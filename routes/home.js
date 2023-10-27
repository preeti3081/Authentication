const express = require('express');
const router = express.Router();
const passport = require('passport');
const homeController = require('../controllers/home');

router.get('/home',passport.checkAuthentication,homeController.home);
router.get('/sign-in',homeController.signIn);
router.get('/sign-up',homeController.signUp);

router.post('/create',homeController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/sign-in'},
),homeController.createSession);
router.get('/sign-out',homeController.destroySession);

//social authentication
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/sign-in'}),homeController.createSession);

module.exports = router;