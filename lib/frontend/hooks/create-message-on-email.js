var debug = require('debug')('alert'),
    message = require('../../resources/message').message,
    email = require('../../resources/email'),
    config = require('../../../config');

email.on('send', function (data) {
  return;
  //console.log('sending', data)
  message.create({
    "to": data.account,
    "from": data.from,
    "subject": data.subject,
    "body": data.html || data.text
  }, function(err, result){
    console.log(err, result)
  });
});
