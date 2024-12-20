const md5 = require("md5");
const responsesCommon = require("../../common/response.common");
const utilities = require("../../services/utilitiesservices");
const businessusers = require("../../models").businessusers;
const nodemailer = require("nodemailer");
const { default: axios } = require("axios");

/**
 * @description
 * This function is used for sending OTP to users.
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
async function sendotp(req, res) {
  try {
    const bodyData = req.body;

    if (!bodyData.email) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "Please provide identifier!",
            400,
            null
          )
        );
    }

    const existUser = await businessusers.findOne({
      where: { bus_email: bodyData.email },
    });

    if (existUser) {
      if (bodyData.email === existUser.bus_email) {
        let otp = utilities.generateOTP();
        try {
          await utilities.sendOTP(
            bodyData.email,
            otp,
            "Your OTP for changing Tecdemy account password",
            existUser.first_name
          );
        } catch (error) {
          console.error("Error sending OTP email:", error);
          return res
            .status(500)
            .send(
              responsesCommon.formatErrorMessage(
                "Failed to send OTP email",
                500,
                null
              )
            );
        }

        // const otpEncrypted = md5(otp);

        const otpExpiry = Date.now() + 10 * 60000;

        await businessusers.update(
          { otp: otp, otp_expiry: otpExpiry },
          { where: { bus_email: bodyData.email } }
        );

        return res
          .status(200)
          .send(
            responsesCommon.apiformatSuccessMessage(
              "OTP sent successfully",
              null
            )
          );
      } else {
        return res
          .status(400)
          .send(
            responsesCommon.formatErrorMessage("Email mismatch", 400, null)
          );
      }
    } else {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "There is no user with this email",
            400,
            null
          )
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage("Internal Server Error", 500, null)
      );
  }
}

async function emailotp(req, res) {
  try {
    const bodyData = req.body;

    if (!bodyData.email) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "Please provide identifier!",
            400,
            null
          )
        );
    }

    const existUser = await businessusers.findOne({
      where: { bus_email: bodyData.oldEmail },
    });

    // if (existUser) {
    //   if (bodyData.email === existUser.bus_email) {
    let otp = utilities.generateOTP();
    try {
      await utilities.sendEmailOTP(
        bodyData.email,
        otp,
        "Your OTP for changing Tecdemy account email",
        existUser.first_name
      );
    } catch (error) {
      console.error("Error sending OTP email:", error);
      return res
        .status(500)
        .send(
          responsesCommon.formatErrorMessage(
            "Failed to send OTP email",
            500,
            null
          )
        );
    }

    // const otpEncrypted = md5(otp);
    const otpExpiry = Date.now() + 10 * 60000;

    await businessusers.update(
      { otp: otp, otp_expiry: otpExpiry },
      { where: { bus_email: bodyData.oldEmail } }
    );

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage("OTP sent successfully", null)
      );
  } catch (error) {
    //   else {
    //     return res
    //       .status(400)
    //       .send(
    //         responsesCommon.formatErrorMessage("Email mismatch", 400, null)
    //       );
    //   }
    // } else {
    //   return res
    //     .status(400)
    //     .send(
    //       responsesCommon.formatErrorMessage(
    //         "There is no user with this email",
    //         400,
    //         null
    //       )
    //     );
    // }
    console.log(error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage("Internal Server Error", 500, null)
      );
  }
}

async function emailupdate(req, res) {
  try {
    const { email, oldEmail, otp, user_id } = req.body;

    if (!email) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "Please provide an email!",
            400,
            null
          )
        );
    }

    if (!otp) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "Please provide the OTP!",
            400,
            null
          )
        );
    }

    const user = await businessusers.findOne({
      where: { bus_email: email },
    });


    if (user) {
      return res
        .status(404)
        .send(responsesCommon.formatErrorMessage("User already registered!", 404, null));
    }

    const existUser = await businessusers.findOne({
      where: { bus_email: oldEmail },
    });

    if (existUser) {
      const now = Date.now();
      if (now > existUser?.otp_expiry) {
        return res
          .status(400)
          .send(responsesCommon.formatErrorMessage("OTP expired", 400, null));
      }
    }

    if (!existUser) {
      return res
        .status(404)
        .send(responsesCommon.formatErrorMessage("User not found!", 404, null));
    }

    if (otp !== existUser.otp) {
      return res
        .status(401)
        .send(
          responsesCommon.formatErrorMessage("OTP doesn't match!", 401, null)
        );
    }

    await businessusers.update(
      { bus_email: email },
      { where: { bus_email: oldEmail } }
    );
    if (!!user_id) {
      await axios.post(`${process.env.APP_NODE_URL}/api/user/createNotifications`, {
        user_id: user_id,
        title: `Your email has been updated to <strong>${email}</strong>!`,
        org: "tecdemy",
        external_url_title: "",
        external_url: ``,
        category: "update"
      })
    }

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage("Email updated successfully", null)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage("Internal Server Error", 500, null)
      );
  }
}

async function sendemailupdate(req, res) {
  try {
    const bodyData = req.body;

    const existUser = await businessusers.findOne({
      where: { bus_email: bodyData.email },
    });

    if (!bodyData.email) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "Please provide identifier!",
            400,
            null
          )
        );
    }
    try {
      await utilities.sendupdatedemail(
        bodyData.email,
        existUser.first_name,
        "Password updated successfully"
      );
    } catch (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .send(
          responsesCommon.formatErrorMessage("Failed to send  email", 500, null)
        );
    }

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage("OTP sent successfully", null)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage("Internal Server Error", 500, null)
      );
  }
}
async function sendMentorNotification(req, res) {
  try {
    const bodyData = req.body;

    const existUser = await businessusers.findOne({
      where: { bus_email: bodyData.mentor_email },
    });

    if (!existUser) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "Please provide identifier!",
            400,
            null
          )
        );
    }
    try {
      await utilities.sendmentoremail(
        bodyData.mentor_email,
        bodyData.mentor_name,
        bodyData.course_title
      );
    } catch (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .send(
          responsesCommon.formatErrorMessage("Failed to send  email", 500, null)
        );
    }

    return res
      .status(200)
      .send(
        responsesCommon.formatSuccessMessage("OTP sent successfully", null)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage("Internal Server Error", 500, null)
      );
  }
}





async function sendPurchaseNotification(req, res) {
  try {
    const { order_id, user_email, user_name, items, total_amount } = req.body;

    if (!order_id || !user_email || !user_name || !items || items.length === 0 || !total_amount) {
      return res
        .status(400)
        .send(
          responsesCommon.formatErrorMessage(
            "Order ID, user email, user name, items, and total amount are required!",
            400,
            null
          )
        );
    }

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const adminEmail = "sreenunaru672@gmail.com";
    const subject = "Course Purchase Notification";

    // Dynamically generate the items table HTML
    const itemsTableHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;">Item Name</th>
            <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;">Quantity</th>
            <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="border: 1px solid #dddddd; padding: 8px;">${item.name}</td>
              <td style="border: 1px solid #dddddd; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid #dddddd; padding: 8px;">$${item.unit_amount.value}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const htmlContentAdmin = `
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
                  background-color: #ffffff;
                  border: 1px solid #dddddd;
              }
              .header {
                  height: 70px;
                  width: 100%;
              }
              .image {
                  text-align: center;
                  background-color: #ffffff;
                  padding-bottom: 0px;
              }
              .image img {
                  max-width: 300px;
                  max-height: 120px;
              }
              .content {
                  text-align: center;
                  padding: 0px 50px;
                  padding-top: 0px;
                  font-size: 16px;
                  color: black;
              }
              .content p {
                  line-height: 30px;
              }
              .Note {
                  font-size: 14px;
              }
              .footer {
                  text-align: center;
                  font-size: 14px;
                  color: black;
                  background-color: #f1def8;
                  border-top: 1px solid #dddddd;
                  padding: 20px 30px;
                  padding-bottom: 0px;
                  margin-top: 20px;
              }
              .footer a {
                  color: #656bc9;
                  text-decoration: none;
              }
              .footer img {
                  max-width: 200px;
                  margin: 0 5px;
              }
              .footer-links {
                  display: flex;
                  padding: 0px;
                  height: 50px;
                  align-items: center;
                  justify-content: space-between;
                  border-top: 1px solid;
                  margin-top: 40px;
              }
              .links {
                  color: black !important;
                  font-size: 13px;
                  padding-right: 5px;
                  font-weight: 700;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header"></div>
              <div class="image">
                  <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo">
              </div>
              <div class="content">
                  <h2>Hello Admin,</h2>
                  <p>A user has purchased a course on Tecdemy platform. Here are the details:</p>
                  <p><strong>Order ID:</strong> ${order_id}</p>
                  <p><strong>Username:</strong> ${user_name}</p>
                  <p><strong>Email:</strong> ${user_email}</p>
                  ${itemsTableHtml}
                  <p><strong>Total Amount:</strong> $${total_amount}</p>
                  <p class="Note">Note: This is an automated message. Please do not reply.</p>
              </div>
              <div class="footer">
                  <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo">
                  <p>&copy; 2024 Your Company. All rights reserved.</p>
                  <div class="footer-links">
                      <div>
                          <a href="#"><img src="cid:instagramIcon" alt="Instagram"></a>
                          <a href="#"><img src="cid:linkedinIcon" alt="LinkedIn"></a>
                          <a href="#"><img src="cid:facebookIcon" alt="Facebook"></a>
                      </div>
                      <div>
                          <a href="#" class="links">Support</a>
                          <a href="#" class="links">Unsubscribe</a>
                          <a href="#" class="links">Privacy Terms</a>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    const htmlContentUser = `
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
                  background-color: #ffffff;
                  border: 1px solid #dddddd;
              }
              .header {
                  height: 70px;
                  width: 100%;
                  
              }
              .image {
                  text-align: center;
                  background-color: #ffffff;
                  padding-bottom: 0px;
              }
              .image img {
                  max-width: 300px;
                  max-height: 120px;
              }
              .content {
                  text-align: center;
                  padding: 0px 50px;
                  padding-top: 0px;
                  font-size: 16px;
                  color: black;
              }
              .content p {
                  line-height: 30px;
              }
              .Note {
                  font-size: 14px;
              }
              .footer {
                  text-align: center;
                  font-size: 14px;
                  color: black;
                  background-color: #f1def8;
                  border-top: 1px solid #dddddd;
                  padding: 20px 30px;
                  padding-bottom: 0px;
                  margin-top: 20px;
              }
              .footer a {
                  color: #656bc9;
                  text-decoration: none;
              }
              .footer img {
                  max-width: 200px;
                  margin: 0 5px;
              }
              .footer-links {
                  display: flex;
                  padding: 0px;
                  height: 50px;
                  align-items: center;
                  justify-content: space-between;
                  border-top: 1px solid;
                  margin-top: 40px;
              }
              .links {
                  color: black !important;
                  font-size: 13px;
                  padding-right: 5px;
                  font-weight: 700;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header"></div>
              <div class="image">
                  <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo">
              </div>
              <div class="content">
                  <h2>Hello ${user_name},</h2>
                  <p>Thank you for purchasing a course on Tecdemy platform. Here are your purchase details:</p>
                  <p><strong>Order ID:</strong> ${order_id}</p>
                  ${itemsTableHtml}
                  <p><strong>Total Amount:</strong> $${total_amount}</p>
                  <p class="Note">Note: This is an automated message. Please do not reply.</p>
              </div>
              <div class="footer">
                  <img src="https://res.cloudinary.com/sreenivasnaru/image/upload/v1716375826/WhatsApp_Image_2024-04-03_at_8.14.20_PM-removebg-preview_a6i3pg.png" alt="Tecdemy Logo">
                  <p>&copy; 2024 Your Company. All rights reserved.</p>
                  <div class="footer-links">
                      <div>
                          <a href="#"><img src="cid:instagramIcon" alt="Instagram"></a>
                          <a href="#"><img src="cid:linkedinIcon" alt="LinkedIn"></a>
                          <a href="#"><img src="cid:facebookIcon" alt="Facebook"></a>
                      </div>
                      <div>
                          <a href="#" class="links">Support</a>
                          <a href="#" class="links">Unsubscribe</a>
                          <a href="#" class="links">Privacy Terms</a>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    let infoAdmin = await transporter.sendMail({
      from: `"Tecdemy" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: subject,
      html: htmlContentAdmin,
      attachments: [
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

    let infoUser = await transporter.sendMail({
      from: `"Tecdemy" <${process.env.EMAIL_USER}>`,
      to: user_email,
      subject: "Your Course Purchase Confirmation",
      html: htmlContentUser,
      attachments: [
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
    return res
      .status(200)
      .send(
        responsesCommon.apiformatSuccessMessage(
          "Purchase notification and confirmation sent successfully",
          null
        )
      );
  } catch (error) {
    console.log("Error sending purchase notification:", error);
    return res
      .status(500)
      .send(
        responsesCommon.formatErrorMessage("Internal Server Error", 500, null)
      );
  }
}




module.exports = { sendotp, emailotp, emailupdate, sendemailupdate, sendPurchaseNotification, sendMentorNotification };
