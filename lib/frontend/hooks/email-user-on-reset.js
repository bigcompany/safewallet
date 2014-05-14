var user = require('../../resources/user'),
    email = require('../../resources/email'),
    config = require('../../../config');

user.on('reset', function (data) {
  data.ip = data.ip || "0.0.0.0";
  if (typeof data.email !== 'undefined' && data.email.length > 0) {
     var message = {
       "api_user": config.sendgrid.api_user,
       "api_key": config.sendgrid.api_key,
       "to": data.email,
       "from": "accounts@safewallet.org",
       "subject": "SafeWallet password reset",
       "text": "An account reset has been requested for your account from " + data.ip +" \n\nVisit this url to reset your password: http://safewallet.org/reset?token=" + data.token
     };
     email.send(message, function(err, result){
       if (err) {
         console.log('ERROR: Unable to send reset email ' + JSON.stringify(err, data));
       }
     });
   }
});
