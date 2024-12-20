const nodemailer = require("nodemailer");

function generateOTP() {
  const digits = "0123456789";

  let otpLength = 6;
  let otp = "";

  for (let i = 1; i <= otpLength; i++) {
    let index = Math.floor(Math.random() * digits.length);
    otp = otp + digits[index];
  }

  return otp;
}

// Function to send OTP to email
async function sendOTP(email, otp, subject, username) {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd;">
    <div style="height: 50px; width: 100%; "></div>
        <div style="text-align: center; padding-bottom: 0px;">
            <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo" style="max-width: 300px; max-height: 120px;">
        </div>
        <div style="text-align: center; padding: 0px 50px; padding-top: 0px; font-size: 16px; color: black;">
            
            <h2 style="font-size: 24px; margin: 20px 0;">Hello ${username}</h2>
            <img src="cid:mainImage" alt="mainImage" style="max-width: 100%; height: auto; margin-bottom: 20px;">
            <p style="line-height: 30px;">We Received A Request To Reset Your Password. Please Use The Following OTP To Reset Your Password</p>
            <div style="height: 60px; letter-spacing: 10px; display: flex; align-items: center; justify-content: center; gap: 0px; margin-left: 150px; font-size: 30px; font-weight: 500; color: #526df5;">
                <span style="color: black; font-weight: 500; font-size: 40px;">[</span>
                <span style="margin-top: 10px;">${otp}</span>
                <span style="color: black; font-weight: 500; font-size: 40px;">]</span>
            </div>
            <p style="font-size: 14px;">Note: This OTP Is Valid For 10 Minutes. Do Not Share This Code With Anyone.</p>
        </div>
        <div style="text-align: center; font-size: 14px; color: black; background-color: #f1def8; border-top: 1px solid #dddddd; padding: 20px 30px; padding-bottom: 0px; margin-top: 20px;">
            <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo" style="max-width: 200px; margin: 0 5px;">
            <p>If you did not request a password reset, please ignore this email or contact our support team</p>
            <div style="display: flex; padding: 20px; height: 30px; align-items: center; justify-content: space-between; border-top: 1px solid; margin-top: 20px;">
                <div>
                    <a href="#"><img src="cid:instagramIcon" alt="Instagram" style="max-width: 20px; margin: 0 5px;"></a>
                    <a href="#"><img src="cid:linkedinIcon" alt="LinkedIn" style="max-width: 20px; margin: 0 5px;"></a>
                    <a href="#"><img src="cid:facebookIcon" alt="Facebook" style="max-width: 20px; margin: 0 5px;"></a>
                </div>
                <div style="margin-left: 150px;">
                    <a href="#" style="color: black !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Support</a>
                    <a href="#" style="color: black !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Unsubscribe</a>
                    <a href="#" style="color: black !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Privacy Terms</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

    let info = await transporter.sendMail({
      from: `"${process.env.ORG_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      // text: `${text} ${otp}`,
      html: htmlContent,
      attachments: [
        {
          filename: "mainImage.png",
          path: "./upload/images/Mask group.png",
          cid: "mainImage",
        },
        {
          filename: "instagram.png",
          path: "./upload/images/Vector.png",
          cid: "instagramIcon",
        },
        {
          filename: "linkedin.png",
          path: "./upload/images/linkedin-box-fill (1) 1.png",
          cid: "linkedinIcon",
        },
        {
          filename: "facebook.png",
          path: "./upload/images/facebook-circle-fill (1) 1.png",
          cid: "facebookIcon",
        },
      ],
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Error sending OTP:", error);
  }
}


async function sendEmailOTP(email, otp, subject, username) {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd;">
    <div style="height: 50px; width: 100%; "></div>
        <div style="text-align: center; padding-bottom: 0px;">
            <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo" style="max-width: 300px; max-height: 120px;">
        </div>
        <div style="text-align: center; padding: 0px 50px; padding-top: 0px; font-size: 16px; color: black;">
            
            <h2 style="font-size: 24px; margin: 20px 0;">Hello ${username}</h2>
            <img src="cid:mainImage" alt="mainImage" style="max-width: 100%; height: auto; margin-bottom: 20px;">
            <p style="line-height: 30px;">We received a request to update your email. Please use the following OTP to verify your new email address.</p>
            <div style="height: 60px; letter-spacing: 10px; display: flex; align-items: center; justify-content: center; gap: 0px; margin-left: 150px; font-size: 30px; font-weight: 500; color: #526df5;">
                <span style="color: black; font-weight: 500; font-size: 40px;">[</span>
                <span style="margin-top: 10px;">${otp}</span>
                <span style="color: black; font-weight: 500; font-size: 40px;">]</span>
            </div>
            <p style="font-size: 14px;">Note: This OTP Is Valid For 10 Minutes. Do Not Share This Code With Anyone.</p>
        </div>
        <div style="text-align: center; font-size: 14px; color: black; background-color: #f1def8; border-top: 1px solid #dddddd; padding: 20px 30px; padding-bottom: 0px; margin-top: 20px;">
            <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo" style="max-width: 200px; margin: 0 5px;">
            <p>If you did not request a email update, please ignore this email or contact our support team</p>
            <div style="display: flex; padding: 20px; height: 30px; align-items: center; justify-content: space-between; border-top: 1px solid; margin-top: 20px;">
                <div>
                    <a href="#"><img src="cid:instagramIcon" alt="Instagram" style="max-width: 20px; margin: 0 5px;"></a>
                    <a href="#"><img src="cid:linkedinIcon" alt="LinkedIn" style="max-width: 20px; margin: 0 5px;"></a>
                    <a href="#"><img src="cid:facebookIcon" alt="Facebook" style="max-width: 20px; margin: 0 5px;"></a>
                </div>
                <div style="margin-left: 150px;">
                    <a href="#" style="color: black !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Support</a>
                    <a href="#" style="color: black !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Unsubscribe</a>
                    <a href="#" style="color: black !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Privacy Terms</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

    let info = await transporter.sendMail({
      from: `"${process.env.ORG_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      // text: `${text} ${otp}`,
      html: htmlContent,
      attachments: [
        {
          filename: "mainImage.png",
          path: "./upload/images/Mask group.png",
          cid: "mainImage",
        },
        {
          filename: "instagram.png",
          path: "./upload/images/Vector.png",
          cid: "instagramIcon",
        },
        {
          filename: "linkedin.png",
          path: "./upload/images/linkedin-box-fill (1) 1.png",
          cid: "linkedinIcon",
        },
        {
          filename: "facebook.png",
          path: "./upload/images/facebook-circle-fill (1) 1.png",
          cid: "facebookIcon",
        },
      ],
    });

  } catch (error) {
    console.log("Error sending OTP:", error);
  }
}

async function sendupdatedemail(email, username, subject) {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd;">
    <div style="height: 50px; width: 100%; "></div>
        <div style="text-align: center; padding-bottom: 0px;">
            <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo" style="max-width: 300px; max-height: 120px;">
        </div>
        <div style="text-align: center; padding: 0px 50px; padding-top: 0px; font-size: 16px; color: black;">
            
            <h2 style="font-size: 24px; margin: 20px 0;">Hello ${username}</h2>
            <img src="cid:mainImage" alt="mainImage" style="max-width: 100%; height: auto; margin-bottom: 20px;">
            <h4 style="font-size: 20px; color: black;">Password Updated</h4>
            <p style="line-height: 30px;">Your password has been changed successfully.Use your new password to log in</p>
            <a href="https://alpha.tecdemy.com/login">
            <button style="color: white; background-color: #8a0ee5; height: 50px; width:100px; border-radius:5px"; cursor: pointer; border: 0px; font-weight: 700;>Login Now</button>
            </a>
            <div style="height: 60px; letter-spacing: 10px; display: flex; align-items: center; justify-content: center; gap: 0px; margin-left: 150px; font-size: 30px; font-weight: 500; color: #526df5;">
            </div>
        </div>
        <div style="text-align: center; font-size: 14px; color: black; background-color: #f1def8; border-top: 1px solid #dddddd; padding: 20px 30px; padding-bottom: 0px; margin-top: 20px;">
            <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo" style="max-width: 200px; margin: 0 5px;">
            <p>If you did not request a password reset, please ignore this email or contact our support team</p>
            <div style="display: flex; padding: 20px; height: 30px; align-items: center; justify-content: space-between; border-top: 1px solid; margin-top: 20px;">
                <div>
                    <a href="#"><img src="cid:instagramIcon" alt="Instagram" style="max-width: 20px; margin: 0 5px;"></a>
                    <a href="#"><img src="cid:linkedinIcon" alt="LinkedIn" style="max-width: 20px; margin: 0 5px;"></a>
                    <a href="#"><img src="cid:facebookIcon" alt="Facebook" style="max-width: 20px; margin: 0 5px;"></a>
                </div>
                <div style="margin-left: 150px;">
                    <a href="#" style="color: black !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Support</a>
                    <a href="#" style="color: black !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Unsubscribe</a>
                    <a href="#" style="color: black !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Privacy Terms</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    let info = await transporter.sendMail({
      from: `"${process.env.ORG_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      // text: `${text} ${otp}`,
      html: htmlContent,
      attachments: [
        {
          filename: "mainImage.png",
          path: "./upload/images/image 1.png",
          cid: "mainImage",
        },
        {
          filename: "instagram.png",
          path: "./upload/images/Vector.png",
          cid: "instagramIcon",
        },
        {
          filename: "linkedin.png",
          path: "./upload/images/linkedin-box-fill (1) 1.png",
          cid: "linkedinIcon",
        },
        {
          filename: "facebook.png",
          path: "./upload/images/facebook-circle-fill (1) 1.png",
          cid: "facebookIcon",
        },
      ],
    });

  } catch (error) {
    console.log("Error sending OTP:", error);
  }
}
async function sendmentoremail(email, username, coursename) {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #dddddd;">
    <div style="height: 50px; width: 100%; "></div>
        <div style="text-align: center; padding-bottom: 0px;">
            <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo" style="max-width: 300px; max-height: 120px;">
        </div>
        <div style="text-align: center; padding: 0px 50px; padding-top: 0px; font-size: 16px; color: black;">
            
            <h2 style="font-size: 24px; margin: 20px 0;">Hello, ${username}, your ${coursename} course has been purchased now</h2>
            <p style="line-height: 30px;">Get ready to give guidance</p>
            <img src="cid:mainImage" alt="mainImage" style="max-width: 100%; height: auto; margin-bottom: 20px;">
    
            <a href="https://alpha.tecdemy.com/login">
            </a>
            <div style="height: 60px; letter-spacing: 10px; display: flex; align-items: center; justify-content: center; gap: 0px; margin-left: 150px; font-size: 30px; font-weight: 500; color: #526df5;">
            </div>
        </div>
        <div style="text-align: center; font-size: 14px; color: black; background-color: #f1def8; border-top: 1px solid #dddddd; padding: 20px 30px; padding-bottom: 0px; margin-top: 20px;">
            <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo" style="max-width: 200px; margin: 0 5px;">
            <div style="display: flex; padding: 10px; height: 30px; align-items: center; justify-content: space-between; border-top: 1px solid; margin-top: 20px;
                        margin: 0px -50px; background-color:#8a0ee5">
                <div>
                    <a href="#"><img src="cid:instagramIcon" alt="Instagram" style="max-width: 20px; margin: 0 5px; color: white !important;"></a>
                    <a href="#"><img src="cid:linkedinIcon" alt="LinkedIn" style="max-width: 20px; margin: 0 5px; color: white !important;"></a>
                    <a href="#"><img src="cid:facebookIcon" alt="Facebook" style="max-width: 20px; margin: 0 5px; color: white !important;" ></a>
                </div>
                <div style="margin-left: 150px; color: white;">
                    <a href="#" style="color: white !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Support</a>
                    <a href="#" style="color: white !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Unsubscribe</a>
                    <a href="#" style="color: white !important; font-size: 13px; padding-right: 5px; font-weight: 700; text-decoration: none;">Privacy Terms</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    let info = await transporter.sendMail({
      from: `"${process.env.ORG_NAME}" <${process.env.EMAIL_USER}>`,
      to: "sreenunaru672@gmail.com",
      subject: "Your Course is Purchased",
      // text: `${text} ${otp}`,
      html: htmlContent,
      attachments: [
        {
          filename: "mainImage.png",
          path: "./upload/images/tracking the delivery.png",
          cid: "mainImage",
        },
        {
          filename: "instagram.png",
          path: "./upload/images/Vector.png",
          cid: "instagramIcon",
        },
        {
          filename: "linkedin.png",
          path: "./upload/images/linkedin-box-fill (1) 1.png",
          cid: "linkedinIcon",
        },
        {
          filename: "facebook.png",
          path: "./upload/images/facebook-circle-fill (1) 1.png",
          cid: "facebookIcon",
        },
      ],
    });

  } catch (error) {
    console.log("Error sending OTP:", error);
  }
}

async function sendEmailToNewUser(email, username, subject, verificationLink) {
  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #eeeeee;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #dfdbff;
                  padding: 20px 40px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  background-color: #ffffff;
                  padding: 10px;
                  color: #131a22;
                  border-radius: 8px 8px 8px 8px;
              }
              .header img {
                  max-width: 150px;
              }
              .content {
                  padding: 20px;
                  font-size: 16px;
                  color: #555555;
                  line-height: 1.6;
              }
              .footer {
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #888888;
                  border-top: 1px solid #eeeeee;
                  margin-top: 20px;
              }
              .footer a {
                  color: #656bc9;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Company Logo">
              </div>
              <div class="content">
                  <p>Dear ${username},</p>
                  <p>Welcome to Our Service! We're excited to have you on board.</p>
                  <p>Thank you for registering with us. Please verify your email by clicking on the link below:</p>
                  <p><a href="${verificationLink}">Verify Email</a></p>
                  <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                  <p>We're looking forward to providing you with the best service possible.</p>
              </div>
              <div class="footer">
                  <p style="font-size: 12px; color: #888;">Note: This is an automated message. Please do not reply.</p>
                  <p>&copy; 2024 Your Company. All rights reserved.</p>
                  <p><a href="https://www.Tecdemy.com">www.Tecdemy.com</a></p>
              </div>
          </div>
      </body>
      </html>
    `;

    let info = await transporter.sendMail({
      from: `"Tecdemy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    });

  } catch (error) {
    console.log("Error sending email:", error);
  }
}

async function sendAdminNotification(newUserDetails) {
  const { bus_email, first_name } = newUserDetails;

  try {
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const adminEmail = 'iapr04515@gmail.com';
    const subject = 'New User Registration Notification';
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #eeeeee;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #dfdbff;
                  padding: 20px 40px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  background-color: #ffffff;
                  padding: 10px;
                  color: #131a22;
                  border-radius: 8px 8px 8px 8px;
              }
              .header img {
                  max-width: 150px;
              }
              .content {
                  padding: 20px;
                  font-size: 16px;
                  color: #555555;
                  line-height: 1.6;
              }
              .footer {
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #888888;
                  border-top: 1px solid #eeeeee;
                  margin-top: 20px;
              }
              .footer a {
                  color: #656bc9;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Company Logo">
              </div>
              <div class="content">
                  <p>Dear Admin,</p>
                  <p>A new user has registered on Tecdemy platform. Here are the details:</p>
                  <p><strong>Username:</strong> ${first_name}</p>
                  <p><strong>Email:</strong> ${bus_email}</p>
                  
              </div>
              <div class="footer">
                  <p style="font-size: 12px; color: #888;">Note: This is an automated message. Please do not reply.</p>
                  <p>&copy; 2024 Your Company. All rights reserved.</p>
                  <p><a href="https://www.Tecdemy.com">www.Tecdemy.com</a></p>
              </div>
          </div>
      </body>
      </html>
    `;

    let info = await transporter.sendMail({
      from: `"${process.env.ORG_NAME}" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: subject,
      html: htmlContent,
    });

  } catch (error) {
    console.log("Error sending admin notification:", error);
  }
}

module.exports = {
  generateOTP,
  sendOTP,
  sendEmailToNewUser,
  sendupdatedemail,
  sendAdminNotification,
  sendEmailOTP,
  sendmentoremail
};
