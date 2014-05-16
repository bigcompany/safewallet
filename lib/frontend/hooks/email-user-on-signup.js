var debug = require('debug')('alert'),
    user = require('../../resources/user'),
    email = require('../../resources/email'),
    config = require('../../../config');

user.on('signup', function (data) {
  if (typeof data.email !== 'undefined' && data.email.length > 0) {
    var message = {
      "api_user": config.sendgrid.api_user,
      "api_key": config.sendgrid.api_key,
      "to": data.email,
      "from": "accounts@safewallet.org",
      "subject": "Welcome to Safewallet",
      "text": "This is a confirmation email indicating you have signed up for Safewallet.org."
    };
    email.send(message, function (err, result) {
      if (err) {
        return debug('error: unable to send signup email ' + JSON.stringify(data));
      }
      debug('signup email sent to ' + data.email);
    });
  }
});
