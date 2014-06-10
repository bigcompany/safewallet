var debug = require('debug')('alert'),
    user = require('../../resources/user'),
    email = require('../../resources/email'),
    config = require('../../../config'),
    template = require('fs').readFileSync(__dirname + '/../email/user/reset-password.txt').toString();

user.on('reset', function (data) {
  template = template.replace('{{token}}', data.token);
  if (typeof data.email !== 'undefined' && data.email.length > 0) {
     var message = {
       "api_user": config.sendgrid.api_user,
       "api_key": config.sendgrid.api_key,
       "to": data.email,
       "from": "accounts@safewallet.org",
       "subject": "Safewallet password reset",
       "text": template
     };
     email.send(message, function(err, result){
       if (err) {
         return debug('error unable to send reset email ' + JSON.stringify(err, data));
       }
       debug('password reset email sent to ' + data.email);
     });
   }
});
