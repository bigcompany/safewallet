var user = require('../../resources/user'),
    email = require('../../resources/email'),
    config = require('../../../config');

user.on('signup', function (data) {
  if (typeof data.email !== 'undefined' && data.email.length > 0) {
    var message = {
      "api_user": config.sendgrid.api_user,
      "api_key": config.sendgrid.api_key,
      "to": data.email,
      "from": "accounts@safewallet.org",
      "subject": "Welcome to SafeWallet",
      "text": "This is a confirmation email indicating you have signed up for SafeWallet.org."
    };
    email.send(message, function (err, result) {
      if (err) {
        console.log('ERROR: Unable to send signup email ' + JSON.stringify(data));
      }
    });
  }
});
