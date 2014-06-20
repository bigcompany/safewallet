var debug = require('debug')('alert'),
    user = require('../../resources/user'),
    email = require('../../resources/email'),
    config = require('../../../config'),
    prices = require('../../resources/prices').prices,
    template = require('fs').readFileSync(__dirname + '/../email/user/deposit-confirmation.html').toString();
    wallet = require('../../resources/wallet');

wallet.on('deposit', function (data){
  user.find({ name: data.owner }, function (err, users){
    if (err) {
      throw err;
    }
    // TODO: add check to user profile to determine if email notifications have been disabled
    var _user = users[0];
    template = template.replace('{{name}}', data.owner);
    template = template.replace('{{amount}}', data.transaction.amount);
    template = template.replace('{{currency}}', data.transaction.currency);
    template = template.replace('{{price}}', data.transaction.price.total);
    // TODO: add price lookup
    // template = template.replace('{{price}}', '$123.00');
    if (typeof _user.email !== 'undefined' && _user.email.length > 0) {
       var message = {
         "api_user": config.sendgrid.api_user,
         "api_key": config.sendgrid.api_key,
         "to": _user.email,
         "from": "accounts@safewallet.org",
         "subject": "Safewallet deposit confirmation",
         "html": template,
         "account": _user.name
       };
       email.send(message, function(err, result){
         if (err) {
           return debug('error unable to send deposit confirmation email ' + JSON.stringify(err, data));
         }
         debug('deposit confirmation email sent to ' + _user.email);
       });
    }
  });
});
