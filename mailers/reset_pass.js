const nodemailer = require('../config/nodemailer');
const secure = require('../config/secure');

exports.newmail = (link)=>{
    console.log('inside reset password');

    const htmlString = nodemailer.renderTemplate({link: link}, '/reset.ejs');

    nodemailer.transporter.sendMail({
        from: secure.email,
        to: link.email,
        subject: "reset password",
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Reset password link has been sent',info);
        return;
    });
}       