const nodemailer = require('nodemailer');
//const sgMail = require('@sendgrid/mail');
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const from = process.env.GMAIL_NAME+"<" + process.env.GMAIL_USER + ">";

function sendToEmail (toEmail, subject, message, isHTML = true) {
  
  if(process.env.MAIL_OPTION=='gmail'){
    const transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASSWORD 
	  }
	});
	
	const mailOptions = {
	  from: from,
	  to: toEmail,
	  subject: subject,
	  html: message
	};
	
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		console.log(error)
        console.log('Mail failed to sent: ' + error);
	  } else {
		console.log('Mail Sent: ', info);
	  }
	});
  }
  /*
  if(process.env.MAIL_OPTION=='sendgrid'){
	  
	  const mailOptions = {
		from: { email: process.env.AUTH_MAIL, name: '' },
		to: toEmail,
		subject: subject,
		priority: 'high'
	  };
	
	  if (isHTML) { mailOptions.html = message; } else { mailOptions.txt = message; }
	
	  sgMail.send(mailOptions)
	  .then((sent) => {
		console.log('Mail Sent: ', sent);
	  }).catch(err => {
		console.log(err)
		console.log('Mail failed to sent: ' + err.message);
	  });
	  
  }*/
	
}
module.exports = { sendemail:sendToEmail };
