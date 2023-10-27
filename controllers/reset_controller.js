const User = require('../model/user');
const Reset = require('../model/reset');
const crypto=require('crypto');
const queue = require('../config/kue');
const resetWorkers = require('../workers/reset_mail_workers');

module.exports.forgotGet = function(req,res){
    return res.render('forgot',{
        title:"Forgot Password"
    })
}

module.exports.passwordReset = async function(req,res){
    try{
        const user = User.findOne({email:req.body.email});
        if(user){
            const resetVerify = await Reset.create({
                email: req.body.email,
                isValid: true,
                acessToken: crypto.randomBytes(20).toString('hex')
            });
            console.log(resetVerify);
            const job = queue.create('reset', resetVerify).save(function(err){
                if(err){
                    console.log("Error", err)
                }
                return res.redirect('back')
            })
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('error in creating token',err);
    }
}

// code for show the reset page
module.exports.resetPassPage = async function(req, res){
    try {
        let confirm = await Reset.findOne({acessToken: req.query.acessToken})
        console.log('confirm', confirm)
        if(confirm.isValid == false){
            return res.redirect('*');
        }
        return res.render('recover', {
            title: 'ESR | Reset Password',
            token: req.query.acessToken,
            isValid:true

        })
    } catch (error) {
        console.log("Error", error);
    }
}

// code for update the new password
module.exports.updatePassword = async function(req, res){
    try {
        if(req.body.password !== req.body.confirm_password){
            return res.redirect('back')
        }
        let token = await Reset.findOne({acessToken: req.body.token})
        if (!token) {
            // Handle the case where the token is not found
            req.flash("error", "Token not found or has expired.");
            return res.redirect('/reset/forgot'); // Redirect to an appropriate page
        }

        if (token.isValid === false) {
            // Handle the case where the token is no longer valid
            req.flash("error", "Token has already been used.");
            return res.redirect('/reset/forgot'); // Redirect to an appropriate page
        }
        token.isValid = false;
        await token.save();
        
        let user = await User.findOne({email: token.email});
        if (!user) {
            // Handle the case where the user is not found
            req.flash("error", "User not found.");
            return res.redirect('/reset/forgot'); // Redirect to an appropriate page
        }

        user.password = req.body.password;
        await user.save();
        req.flash("success", "password has been updated successfully");
        res.redirect('/sign-in')
        
    } catch (error) {
        console.log('Error', error);
    }
}