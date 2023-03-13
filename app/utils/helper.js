const jwt = require('jsonwebtoken');
const { hash } = require('bcrypt');
const nodemailer = require('nodemailer');

/**
 * encrypts password
 * @param {string} password
 * @returns encrypted password
 */
async function hashPassword(password) {
  // auto generate a salt and hash
  return hash(password, 10);
}

/**
 * generates new access token
 * @param {object} obj - field to pass in token
 * @returns {string} accessToken
 */
function generateAccessToken(obj) {
  return jwt.sign(obj, process.env.API_SECRET, {
    expiresIn: '15m'
  });
}

/**
 * sends mail to user's email with reset token
 * to set a new password
 * @param {string} resetToken - token to reset password
 * @param {string} emailTo - email to send to
 */
function sendEmail(token, emailTo) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.MAIL_CLIENT_ID,
      clientSecret: process.env.MAIL_CLIENT_SECRET,
      refreshToken: process.env.MAIL_REF_TOKEN
    }
  });

  const mailOptions = {
    from: `${process.env.MAIL_USER}`,
    to: `${emailTo}`,
    subject: 'Password reset',
    text: 'Find below your reset password',
    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
  </head>
  <head>
	  <style type="text/css">
      .body {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #444444;
        background-color: #f2f2f2;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }

      h1, p {
        margin-top: 0;
        margin-bottom: 20px;
      }

      .btn {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        color: #ffffff;
        background-color: #1e88e5;
        border-radius: 5px;
        text-decoration: none;
      }
	  </style>
  </head>
  <div class="body">
    <div class="container">
      <h1>Reset Your Password</h1>
      <p>Hello!,</p>
      <p>We received a request to reset your password. If you did not make this request, you can safely ignore this email.</p>
      <p>To reset your password, please click the button below:</p>
      <a href="https://github.com/tommydebisi" class="btn">Reset Password</a>
      <p>${token}</p>
      <p>If you have any questions or concerns, please contact our support team.</p>
      <p>Thank you,</p>
      <p>The KudiFlow Team</p>
    </div>
  </div>
  </html>`
  }

  // convert callback to promise

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log('Error ' + err);
    } else {
      console.log('Sent reset email succesfully');
    }
  });

}


module.exports = {
  hashPassword,
  generateAccessToken,
  sendEmail,
}
