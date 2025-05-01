const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, name, verificationToken) => {
   const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
      },
   });

   const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `<h3>Welcome to our platform, ${name}!</h3>
    <p>Please verify your email by clicking on the following link:</p>
    <a href="${process.env.CLIENT_URL}/verify-email?token=${verificationToken}">Verify Email</a>
    <p>This link will expire in 1 hour.</p>`,
   };

   await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, name, resetLink) => {
   const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
      },
   });

   const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<h3>Hello ${name},</h3>
    <p>You requested to reset your password. Click the link below to reset it:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link will expire in 1 hour. If you did not request this, please ignore this email.</p>`,
   };

   await transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (to, name, username, password) => {
   const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
      },
   });

   const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Welcome to Our Platform",
      html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a4a4a;">Welcome, ${name}!</h2>
            <p>Your account has been created by the administrator.</p>
            <p>Here are your login credentials:</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
               <p><strong>Username/Email:</strong> ${username}</p>
               <p><strong>Password:</strong> ${password}</p>
            </div>
            <p>Please log in and change your password as soon as possible for security reasons.</p>
            <p>If you didn't request this account, please contact our support team immediately.</p>
            <br>
            <p>Best regards,</p>
            <p>The Support Team</p>
         </div>
      `
   };

   try {
      await transporter.sendMail(mailOptions);
   } catch (error) {
      console.error("Error sending welcome email:", error);
      throw error;
   }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail };
