const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../model/user');

passport.use(new googleStrategy({
        clientID: "430809856787-a0ne33b8me0f9us9a586a50rmgq1r20m.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL: "http://localhost:8000/auth/google/callback",
        passReqToCallback:true
    },
    async function(req,accessToken,refreshToken,profile,done){
        try{
            const user = await User.findOne({email:profile.emails[0].value});
            if(user){
                console.log(profile);
                return done(null,user);
            }else{
                await User.create({
                    name: profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                });
                req.flash('success',"logged in Successfully");
        }

        }catch(err){
            console.log('error in google strategy-passport',err);
            return;
        }
        
    }
));
module.exports = passport;