const Users = require('../models').users;
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const md5 = require('md5');
const utilities = require('./utilitiesservices');
var mail = require('./email/sendemail');

async function createNewUser(bodyData, res) {
  return new Promise(async (resolve, reject) => {
    const query = { email_id: bodyData.emailId };
    const existUser = await Users.findOne({ where: query });
    if (existUser != '' && existUser != null && "undefined" !== typeof existUser) {
      if (bodyData.loginType == existUser.login_type) {
        var sessiontoken = await saveSession(existUser, 'user');
        return resolve({ code: 400, message: 'Email already in use!', data: existUser, userToken: sessiontoken.userToken });
      } else {
        return resolve({ code: 400, message: 'Email already in use!' });
      }
    } else {
      if (bodyData.loginType == 'system') {
        if ("undefined" === typeof bodyData.password || bodyData.password == '' || bodyData.password == null) {
          return resolve({ code: 400, message: 'Please provide password!' });
        } else {
          bodyData.password = md5(bodyData.password);
        }
        let otp = utilities.generateOTP();
        const otpEncrypted = md5(otp);
        const newUser = {
          email_id: bodyData.emailId,
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
          roles: bodyData.roles
        }
        await Users.create(newUser).then(async (response) => {
          // this added temp
          var sessiontoken = await saveSession(response, bodyData.roles);
          if (sessiontoken != '' && sessiontoken != null && "undefined" !== typeof sessiontoken) {
            return resolve({ code: 200, message: 'User created successfully!!', data: response, userToken: sessiontoken.userToken });
          } else {
            return res.status(400).send(responsesCommon.formatErrorMessage('Error session token!', 400, null));
          }
          // mail stoped temp for now 
          // res.render("email/signup", { pagename: 'signup', userdata: response, baseUrl: process.env.BASE_URL, token: otp, siteurl: process.env.SITE_URL, otptoken: otpEncrypted }, function (err, emailhtml) {
          //   console.log("err===", err);
          //   mail.sendemail(response.email_id, 'Email verification', emailhtml);
          // });
          return resolve({ code: 200, message: 'User created successfully!!', data: response, userToken: null });
        }).catch((err) => {
          return resolve({ code: 400, message: 'Error in creating new users!' });
        })
      } else {
        let otp = utilities.generateOTP();
        bodyData.password = md5(otp);
        const newUser = {
          email_id: bodyData.emailId,
          first_name: bodyData.firstName,
          last_name: bodyData.lastName,
          password: bodyData.password,
          is_active: true,
          is_delete: false,
          email_verified: true,
          has_password: true,
          login_type: bodyData.loginType,
          provider_token: bodyData.providerToken,
          roles: bodyData.roles
        }
        await Users.create(newUser).then(async (response) => {
          var sessiontoken = await saveSession(response, bodyData.roles);
          if (sessiontoken != '' && sessiontoken != null && "undefined" !== typeof sessiontoken) {
            return resolve({ code: 200, message: 'User created successfully!!', data: response, userToken: sessiontoken.userToken });
          } else {
            return res.status(400).send(responsesCommon.formatErrorMessage('Error session token!', 400, null));
          }
        }).catch((err) => {
          return resolve({ code: 400, message: 'Error in creating new users!' });
        })
      }
    }
  })
}

async function saveSession(userData, userRole) {
  return new Promise(async (resolve, reject) => {

    var result = await setSessionToken(userData?.id, userRole);
    if (result != '' && result != null && "undefined" !== typeof result) {
      const userSession = ({
        userId: userData.id,
        userType: userRole,
        userToken: result,
        isExpired: false,
        createdAt: new Date().toISOString()
      });
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
        status: 'Active',
        expiry: new Date(nextDate).toISOString()
      }
    };
    // session signin
    jwt.sign(payload, process.env.AUTH_TOKEN, { expiresIn: '1d' }, function (err, token) {
      if (err) {
        return reject(err.name, err.message);
      } else {
        return resolve(token);
      }
    });

  });
}

async function getUserLoginDetails(bodyData) {
  return new Promise(async (resolve, reject) => {
    const loginType = bodyData.loginType;
    const emailId = bodyData.emailId;
    if (loginType == "system") {
      const password = md5(bodyData.password);
      var query = {
        login_type: loginType, email_id: emailId, password: password,
        // email_verified: true
      };
    } else if (loginType == "google") {
      var query = {
        email_id: emailId
      }
    }
    else {
      var query = { login_type: loginType, email_id: emailId };
    }
    await Users.findOne({
      where: query,
      attributes: ["id", "email_id", "first_name", "last_name", "profile_url", "mobile_number", "address", "roles", "profile_url", "login_type", "provider_token", "createdAt"]
    }).then(async function (response) {
      if (response) {
        const responseData = JSON.parse(JSON.stringify(response));
        var sessiontoken = await saveSession(responseData, 'Student');
        if (sessiontoken != '' && sessiontoken != null && "undefined" !== typeof sessiontoken) {
          return resolve({ code: 200, data: responseData, userToken: sessiontoken.userToken });
        } else {
          return res.status(400).send(responsesCommon.formatErrorMessage('Error session token!...', 400, null));
        }
      } else {
        return resolve({ code: 400, message: 'No User Found!' });
      }
    })
  })
}
async function getUserById(userId) {
  return new Promise(async (resolve, reject) => {
    await Users.findOne({ where: { id: userId } }).then(function (result) {
      const userData = JSON.parse(JSON.stringify(result));
      return resolve(userData);
    }).catch((err) => {
      return reject(err);
    });
  })
}
async function verifyOtp(bodyData) {
  return new Promise(async (resolve, reject) => {
    const userId = bodyData.userId;
    const otp = bodyData.otp;
    const otpEncrypted = md5(otp);
    await Users.findOne({ where: { id: userId, email_verify_token: otpEncrypted } }).then(function (result) {
      const userData = JSON.parse(JSON.stringify(result));
      return resolve({ code: 200, data: userData });
    }).catch((err) => {
      return resolve({ code: 400, data: null, message: 'Invalid Otp' });
    });
  })
}
module.exports = {
  createNewUser,
  saveSession,
  setSessionToken,
  getUserLoginDetails,
  getUserById,
  verifyOtp
}