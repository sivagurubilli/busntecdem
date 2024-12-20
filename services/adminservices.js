const Adminusers = require('../models').adminusers;
const jwt = require('jsonwebtoken');
const md5 = require('md5');

async function getAdminDetails(bodydata) {
  return new Promise(async (resolve, reject) => {
    const password = md5(bodydata.password);
    const whereClause = {
      email_id: bodydata.emailId, is_active: 1, password: password
    }

    const adminData = await Adminusers.findOne({ where: whereClause });
    if (adminData) {
      const userData = JSON.parse(JSON.stringify(adminData));
      return resolve({ code: 200, data: userData });
    } else {
      return resolve({ code: 400, message: 'Invalid Login Credentials!!' });
    }
  })
}


async function saveSession(userData) {
  return new Promise(async (resolve, reject) => {

    var result = await setSessionToken(userData?.id, userData.role);
    if (result != '' && result != null && "undefined" !== typeof result) {
      const userSession = ({
        userId: userData.id,
        userType: userData.role,
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

module.exports = {
  getAdminDetails,
  saveSession,
  setSessionToken
}