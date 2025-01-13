const nodemailer = require("nodemailer");
require('dotenv').config() ;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587, 
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
    debug: true, 
    logger: true, 
});

exports.sendEmail = async (recipient, subject, text) => {
    try {
        const mailOptions = {
            from: "pranav.99776@gmail.com", 
            to: recipient, 
            subject: subject, 
            text: text, 
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipient}`);
    } catch (error) {
        console.error(`Failed to send email to ${recipient}:`, error.message);
    }
};


