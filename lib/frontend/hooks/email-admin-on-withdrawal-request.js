var debug = require('debug')('alert'),
    ledger = require('../../resources/ledger').ledger,
    email = require('../../resources/email'),
    config = require('../../../config'),
    user = require('../../resources/user'),
    wallet = require('../../resources/wallet'),
    uuid = require('node-uuid'),
    adminEmail = "admin@safewallet.org",
    template = "";

template = require('fs').readFileSync(__dirname + '/../email/admin/withdrawal-pending.html').toString();

// Notify admin after ledger entry is updated or created
ledger.on('update', notifyAdmin);
ledger.on('create', notifyAdmin);

function notifyAdmin (data) {

  if (data.status === "pending") {

    subject = data.owner + " Safewallet withdrawal pending";
    template = template.replace('{{name}}', data.owner);
    template = template.replace('{{amount}}', data.amount);
    template = template.replace('{{currency}}', data.currency);
    template = template.replace('{{price}}', data.price.total);
    template = template.replace('{{link}}', "http://safewallet.org/admin?t=" + data.transactionID);

    var message = {
      "api_user": config.sendgrid.api_user,
      "api_key": config.sendgrid.api_key,
      "to": adminEmail,
      "from": "accounts@safewallet.org",
      "subject": subject,
      "html": template
    };

    email.send(message, function(err, result){
      if (err) {
        return debug('error unable to send ' + subject.toLowerCase() +  ' email ' + JSON.stringify(err, data));
      }
      debug(subject.toLowerCase() + ' email sent to ' + adminEmail);
    });

  }

}