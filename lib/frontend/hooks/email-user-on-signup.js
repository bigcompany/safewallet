var debug = require('debug')('alert'),
    user = require('../../resources/user'),
    email = require('../../resources/email'),
    config = require('../../../config')
    template = require('fs').readFileSync(__dirname + '/../email/signup.txt').toString();

user.on('signup', function (data) {
  template = template.replace('{{name}}', data.name);
  if (typeof data.email !== 'undefined' && data.email.length > 0) {
    var message = {
      "api_user": config.sendgrid.api_user,
      "api_key": config.sendgrid.api_key,
      "to": data.email,
      "from": "accounts@safewallet.org",
      "subject": "Welcome to Safewallet",
      "text": template
    };
    email.send(message, function (err, result) {
      if (err) {
        return debug('error: unable to send signup email ' + JSON.stringify(data));
      }
      debug('signup email sent to ' + data.email);
    });
  }
});
