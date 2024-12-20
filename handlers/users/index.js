'use strict';

const signUpHandler = require('./signup');
const userLoginHandler = require('./login');
const verifyEmailHandler = require('./verifyemail');
// const fetchuserHandler = require("./fetchuser");
const bucketlistHandler = require('./bucketlist');
const { fetchuser, filterByRole, filterByRoleMessage } = require('./fetchuser');
module.exports = {
  signUpHandler,
  userLoginHandler,
  verifyEmailHandler,
  fetchuser,
  filterByRole,
  filterByRoleMessage,

  // fetchuserHandler,
  bucketlistHandler,
};
