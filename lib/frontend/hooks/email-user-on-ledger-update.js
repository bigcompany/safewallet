var debug = require('debug')('alert'),
    ledger = require('../../resources/ledger').ledger,
    email = require('../../resources/email'),
    config = require('../../../config'),
    user = require('../../resources/user'),
    wallet = require('../../resources/wallet'),
    uuid = require('node-uuid'),
    template = "",
    templates = {};

// Load email templates
templates['withdrawal-approved'] = require('fs').readFileSync(__dirname + '/../email/user/withdrawal-approved.html').toString();
templates['withdrawal-blocked'] = require('fs').readFileSync(__dirname + '/../email/user/withdrawal-blocked.html').toString();
templates['withdrawal-pending'] = require('fs').readFileSync(__dirname + '/../email/user/withdrawal-pending.html').toString();

// Notify user after ledger entry is updated or created
ledger.on('update', notifyUser);
ledger.on('create', notifyUser);

function notifyUser (data) {

  // Don't send deposit alerts for refunds
  if (data.address === "refund") {
    return;
  }

  user.find({ name: data.owner }, function (err, users){
    if (err) {
      throw err;
    }
    var _user = users[0],
    subject;
    // TODO: add check to user profile to determine if email notifications have been disabled

    // Don't attempt to send notification if no email is available
    if (typeof _user.email === 'undefined' || _user.email.length === 0) {
      return;
    }

    switch (data.status) {
      case 'approved':
        subject = "Safewallet withdrawal approved";
        template = "withdrawal-approved";
      break;
      case 'blocked':
        subject = "Safewallet withdrawal blocked";
        template = "withdrawal-blocked";
      break;
      case 'pending':
        subject = "Safewallet withdrawal pending";
        template = "withdrawal-pending";
      break;
      default:
        return;
      break;
    }

    template = templates[template];
    template = template.replace('{{name}}', data.owner);
    template = template.replace('{{amount}}', data.amount);
    template = template.replace('{{currency}}', data.currency);
    template = template.replace('{{price}}', data.price.total);

    var message = {
      "api_user": config.sendgrid.api_user,
      "api_key": config.sendgrid.api_key,
      "to": _user.email,
      "from": "accounts@safewallet.org",
      "subject": subject,
      "html": template,
      "account": _user.name
    };

    email.send(message, function (err, result) {
      if (err) {
        return debug('error unable to send ' + subject.toLowerCase() +  ' email ' + JSON.stringify(err, data));
      }
      debug(subject.toLowerCase() + ' email sent to ' + _user.email);
    });

  });

}