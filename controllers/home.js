const User = require('../model/user');
const passport = require('passport');

module.exports.home = async function(req,res){
    try{
        const user = await User.findById(req.user.id);
        console.log(user);
        if(user){
            return res.render('home',{
                title :"Authentication | Home",
                user: user
            });
        }
    }catch(err){
        console.log(err);
        return res.redirect('/sign-in');
    }
}

//user sign up
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/home');
    }
    
    return res.render('user_sign_up',{
        title:"Authentication | SignUp"
    });
}

//user sign in 
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/home');
    }
    return res.render('user_sign_in',{
        title: "Authentication | SignIn"
    });
}



//get the sign up data

module.exports.create = async function(req,res){
    try{
        //manual auth
        if(req.body.password !== req.body.confirm_password){
            req.flash('error','Password did not match!');
            return res.redirect('back');
        }
        //if same
        const existinguser = await User.findOne({email: req.body.email});
        if(existinguser){
            console.log('User already exists');
            return res.redirect('/sign-in');
        }
        const newUser = await User.create(req.body);
        req.flash('success',"Sign up successfully");
        console.log('User created successfully',newUser);
        return res.redirect('/sign-in');
    }catch(err){
        console.log('Error in finding user or signing up', err);
        return res.redirect('back');
    }
    
}

//get the sign in data and create session
module.exports.createSession = async function(req,res){
    req.login(req.user, function (err) {
        if (err) {
            req.flash('error','Password did not match');
            console.log('Error setting user session:', err);
            return res.redirect('back');
        }
    req.flash('success',"Logged in Successfully");
    return res.redirect('/home');
    });
}

//to sign out
module.exports.destroySession = function(req,res){
    req.logout(function(err) {
        if (err) {
            // Handle any logout-related errors
            req.flash('error',"Error during logout");
            console.error('Error during logout:', err);
        }})
    req.flash('success','You have logged out!');
    return res.redirect('/sign-in');
}
