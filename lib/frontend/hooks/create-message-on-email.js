var debug = require('debug')('alert'),
    message = require('../../resources/message').message,
    email = require('../../resources/email'),
    config = require('../../../config');

email.on('send', function (data) {
  message.create({
    "to": data.account,
    "from": data.from,
    "subject": data.subject,
    "body": data.html || data.text
  }, function(err, result){
    if (err) {
      throw err;
    }
  });
});
