const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../model/user');

passport.use(new LocalStrategy({
        usernameField: "email",
        passReqToCallback: true
    },
    async function(req,email,password,done){
        //find a user and establish identity
        try{
            const user = await User.findOne({email:email});
            if(!user || user.password != password){
                req.flash('error','Invalid Username/Password');
                console.log('Invalid Username/Password');
                return done(null,false);
            }
            return done(null,user);
        }catch(err){
            req.flash('error',err);
            console.log('Error in finding user -->Passport');
            return done(err);
        }
    }
));
//serialize user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserialize user from the key in the cookies
passport.deserializeUser(async function(id,done){
    try{
        const user = await User.findById(id);
        return done(null,user);
    }catch(err){
        console.log('Error in finding user -->Passport');
        return done(err);
    }    
});

//check if the user is authenticated
passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    
    return res.redirect('/sign-in');
}

//set user for views
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;
