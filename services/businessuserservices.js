const Businessusers = require("../models").businessusers;
const social_media_links = require("../models").social_media_links;

const utilities = require("./utilitiesservices");
var mail = require("./email/sendemail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");

const Permissions = require("../models").permissions; // assuming you have this model
const Menu = require("../models").menu; // assuming you have this model

/**
 * Creates permissions for a user based on available menus.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<void>}
 */
async function createPermissionsForUser(userId) {
  try {
    const menus = await Menu.findAll({ where: { status: 1 } }); // Fetch active menus

    if (menus.length === 0) {
      throw new Error("No active menus found to assign permissions.");
    }

    const permissionsData = menus.map((menu) => ({
      uuid: uuidv4(),
      user_id: userId,
      menu_id: menu.id,
      status: true,
    }));

    await Permissions.bulkCreate(permissionsData, { validate: true });
  } catch (error) {
    console.error("Error in createPermissionsForUser:", error);
    throw new Error("Error creating permissions for the user.");
  }
}

async function createNewUser(bodyData, res) {
  return new Promise(async (resolve, reject) => {
    const query = { bus_email: bodyData.bus_email, is_active: 1 };
    const existUser = await Businessusers.findOne({ where: query });
    if (
      existUser != "" &&
      existUser != null &&
      "undefined" !== typeof existUser
    ) {
      if (bodyData.loginType == existUser.login_type) {
        var sessiontoken = await saveSession(existUser, "businessuser");
        // return resolve({ code:200, data:existUser,userToken:sessiontoken.userToken});
        return resolve({ code: 400, message: "Email already in use!" });
      } else {
        return resolve({ code: 400, message: "Email already in use!" });
      }
    } else {
      if (bodyData.loginType == "system") {
        if (
          "undefined" === typeof bodyData.password ||
          bodyData.password == "" ||
          bodyData.password == null
        ) {
          return resolve({ code: 400, message: "Please provide password." });
        } else {
          bodyData.password = md5(bodyData.password);
        }
        let otp = utilities.generateOTP();
        const otpEncrypted = md5(otp);
        const newUser = {
          bus_email: bodyData.bus_email,
          first_name: bodyData.firstName,
          last_name: bodyData.lastName,
          password: bodyData.password,
          is_active: true,
          is_delete: false,
          email_verified: false,
          email_verify_token: otpEncrypted,
          has_password: true,
          login_type: bodyData.loginType,
          provider_token: bodyData.providerToken,
          roles: bodyData?.roles,
          uuid: uuidv4(),
        };
        Businessusers.create(newUser)
          .then(async (response) => {
            const verificationLink = `${process.env.SITE_URL}/verify-email?token=${otpEncrypted}`;
            await utilities.sendEmailToNewUser(
              newUser.bus_email,
              newUser.first_name,
              "Email Verification",
              verificationLink
            );
            await utilities.sendAdminNotification(newUser);
            // this added temp
            var sessiontoken = await saveSession(response, bodyData?.roles);
            if (
              sessiontoken != "" &&
              sessiontoken != null &&
              "undefined" !== typeof sessiontoken
            ) {
              return resolve({
                code: 200,
                data: response,
                userToken: sessiontoken.userToken,
              });
            } else {
              return res
                .status(400)
                .send(
                  responsesCommon.formatErrorMessage(
                    "Error session token!...",
                    400,
                    null
                  )
                );
            }
            // Mial stpped temp
            // res.render("email/signup", { pagename: 'signup', userdata: response, baseUrl: process.env.BASE_URL, token: otp, siteurl: process.env.SITE_URL, otptoken: otpEncrypted }, function (err, emailhtml) {
            //   console.log("err===", err);
            //   mail.sendemail(response.bus_email, 'Email verification', emailhtml);
            // });
            // return resolve({ code: 200, data: response, userToken: null });
          })
          .catch((err) => {
            return resolve({
              code: 400,
              message: "Error in creating new users!",
            });
          });
      } else {
        let otp = utilities.generateOTP();
        bodyData.password = md5(otp);
        const newUser = {
          bus_email: bodyData.bus_email,
          first_name: bodyData.firstName,
          last_name: bodyData.lastName,
          password: bodyData.password,
          is_active: true,
          is_delete: false,
          email_verified: true,
          has_password: true,
          login_type: bodyData.loginType,
          provider_token: bodyData.providerToken,
          roles: bodyData?.roles,
          uuid: uuidv4(),
        };
        await Businessusers.create(newUser)
          .then(async (response) => {
            // const verificationLink = `${process.env.SITE_URL}/verify-email?token=${otpEncrypted}`;
            // await utilities.sendEmailToNewUser(
            //   newUser.bus_email,
            //   newUser.first_name,
            //   "Email Verification",
            //   verificationLink
            // );
            await utilities.sendAdminNotification(newUser);
            var sessiontoken = await saveSession(response, bodyData?.roles);
            if (
              sessiontoken != "" &&
              sessiontoken != null &&
              "undefined" !== typeof sessiontoken
            ) {
              return resolve({
                code: 200,
                data: response,
                userToken: sessiontoken.userToken,
              });
            } else {
              return res
                .status(400)
                .send(
                  responsesCommon.formatErrorMessage(
                    "Error session token!",
                    400,
                    null
                  )
                );
            }
          })
          .catch((err) => {
            return resolve({
              code: 400,
              message: err?.message,
            });
          });
      }
    }
  });
}

async function saveSession(userData, userRole) {
  return new Promise(async (resolve, reject) => {
    var result = await setSessionToken(userData?.id, userRole);
    if (result != "" && result != null && "undefined" !== typeof result) {
      const userSession = {
        userId: userData?.id,
        userType: userRole,
        userToken: result,
        isExpired: false,
        createdAt: new Date().toISOString(),
      };
      return resolve(userSession);
    } else {
      return resolve(err);
    }
  });
}

async function setSessionToken(userId, userrole) {
  const currentDate = new Date();
  const nextDate = new Date().setDate(currentDate.getDate() + 1);
  return new Promise(async (resolve, reject) => {
    var payload = {
      type: userrole,
      userId: userId,
      request: {
        signed_on: currentDate.toISOString(),
        status: "Active",
        expiry: new Date(nextDate).toISOString(),
      },
    };
    // session signin
    jwt.sign(
      payload,
      process.env.AUTH_TOKEN,
      { expiresIn: "1d" },
      function (err, token) {
        if (err) {
          return reject(err.name, err.message);
        } else {
          return resolve(token);
        }
      }
    );
  });
}

async function getUserById(userId) {
  return new Promise(async (resolve, reject) => {
    await Businessusers.findOne({ where: { id: userId } })
      .then(function (result) {
        const userData = JSON.parse(JSON.stringify(result));
        return resolve(userData);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

async function getPermissionsAndMenus(userId) {
  try {
    const permissions = await Permissions.findAll({
      where: { user_id: userId, status: 1 },
      include: [
        {
          model: Menu,
          as: "menu",
          where: { status: 1, isAdminMenu: 0 },
        },
      ],
    });
    return permissions.map((permission) => permission.menu);
  } catch (error) {
    throw new Error("Error fetching permissions and menus");
  }
}


async function getPermissionsAndMenusForAdmin(userId) {
  try {
    return await Menu.findAll({ where: { status: 1 } });
  } catch (error) {
    console.error("Error in getPermissionsAndMenusForAdmin:", error);
    throw new Error("Error fetching permissions and menus for admin.");
  }
}




async function getLoginDetails(bodyData) {
  return new Promise(async (resolve, reject) => {
    const loginType = bodyData.loginType;
    const emailId = bodyData.emailId;
    if (loginType == "system") {
      if (bodyData.emailverified == false) {
        const password = bodyData.password;
        var query = {
          login_type: loginType,
          bus_email: emailId,
          password: password,
          roles: bodyData?.userType,
          // email_verified: true
        };
        if (bodyData?.org) {
          delete query?.roles;
        }
      } else {
        const password = md5(bodyData.password);
        var query = {
          login_type: loginType,
          bus_email: emailId,
          password: password,
          roles: bodyData?.userType,
          // email_verified: true
        };
        if (bodyData?.org) {
          delete query?.roles;
        }
      }
      // var query = {
      //   login_type: loginType,
      //   bus_email: emailId,
      //   password: password,
      //   roles: bodyData?.userType,
      //   // email_verified: true
      // };
      // if (bodyData?.org) {
      //   delete query?.roles;
      // }
    } else if (loginType == "google") {
      var query = {
        // login_type: loginType,
        bus_email: emailId,
      };
    } else if (loginType == "linkedin") {
      var query = {
        // login_type: loginType,
        bus_email: emailId,
      };
    } else {
      var query = {
        login_type: loginType,
        bus_email: emailId,
      };
    }
    await Businessusers.findOne({
      where: { ...query, is_active: 1 },
      // attributes: ["id", "bus_email", 'first_name', "last_name", 'mobile_number', 'address', 'email_verified', "bus_acnt_name", 'city', "state", "country", "roles", "profile_url", "createdAt", "description", "dob"]
    }).then(async function (response) {
      if (response) {
        const responseData = JSON.parse(JSON.stringify(response));
        // if (!responseData.email_verified) {
        //   return resolve({
        //     code: 400,
        //     message: "Email not verified. Please verify your email to login.",
        //   });
        // }
        const socialMediadata = await social_media_links.findOne({
          where: {
            user_id: responseData?.id,
            status: 1,
          },
        });
        delete socialMediadata?.id;
        var sessiontoken = await saveSession(responseData, "business");
        if (
          sessiontoken != "" &&
          sessiontoken != null &&
          "undefined" !== typeof sessiontoken
        ) {
          if (!!socialMediadata) {
            responseData["socialMediaLinks"] = socialMediadata;
          }
          return resolve({
            code: 200,
            data: responseData,
            userToken: sessiontoken.userToken,
          });
        } else {
          return res
            .status(400)
            .send(
              responsesCommon.formatErrorMessage(
                "Error session token!",
                400,
                null
              )
            );
        }
      } else {
        return resolve({ code: 400, message: "Invalid login credentials!" });
      }
    });
  });
}

async function verifyOtp(bodyData) {
  return new Promise(async (resolve, reject) => {
    const userId = bodyData.userId;
    const otp = bodyData.otp;
    const otpEncrypted = md5(otp);
    await Businessusers.findOne({
      where: { id: userId, email_verify_token: otpEncrypted },
    })
      .then(function (result) {
        const userData = JSON.parse(JSON.stringify(result));
        return resolve({ code: 200, data: userData });
      })
      .catch((err) => {
        return resolve({ code: 400, data: null, message: "Invalid OTP!" });
      });
  });
}

async function assignPermissionsIfNotExist(userId) {
  try {
    const existingPermissions = await Permissions.findOne({
      where: { user_id: userId, status: 1 },
    });

    if (existingPermissions) {
      return { message: "Permissions already assigned", status: "success" };
    }

    const menus = await Menu.findAll({ where: { status: 1 } });

    if (!menus || menus.length === 0) {
      return { message: "No active menus found", status: "error" };
    }

    const permissionsData = menus.map((menu) => ({
      uuid: uuidv4(),
      user_id: userId,
      path: menu.path,
      menu_id: menu.id,
      status: true,
    }));

    await Permissions.bulkCreate(permissionsData, { validate: true });

    return { message: "Permissions assigned successfully", status: "success" };
  } catch (error) {
    console.error("Error assigning permissions:", error);
    throw new Error("Error assigning permissions");
  }
}

module.exports = {
  createNewUser,
  saveSession,
  setSessionToken,
  getUserById,
  getLoginDetails,
  verifyOtp,
  getPermissionsAndMenus,
  assignPermissionsIfNotExist,
  createPermissionsForUser,
  getPermissionsAndMenusForAdmin
};
