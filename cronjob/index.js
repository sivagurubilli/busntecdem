const cron = require('node-cron');
const fs = require('fs');
const userProgressHandler = require('../handlers/users/userProgressHandler');


// Define your cron jobs

// task that runs every hour
// cron.schedule('0 * * * * ', () => {
//   userProgressHandler.deleteDataFromBinAuto();
// });


cron.schedule('*/2 * * * *', () => {  //every two mints
  var app = require('../app');
  const { io } = app;
  io.emit("refreshNotification", {  })

});




// Export a function to start the cron jobs
module.exports = function () {
  console.log('Cron jobs have been started');
};
