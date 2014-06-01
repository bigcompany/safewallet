var debug = require('debug')('alert'),
    ledger = require('../../resources/ledger').ledger,
    config = require('../../../config'),
    user = require('../../resources/user'),
    wallet = require('../../resources/wallet'),
    uuid = require('node-uuid'),
    template = "",
    templates = {};

// Notify user after ledger entry is updated or created
ledger.on('update', checkTransaction);

function checkTransaction (entry) {
  // determine if ledger update was a blocked transaction
  // if transaction has been updated to "blocked", return funds back to wallet
  if (entry.status === "blocked") {
    wallet.find({ owner: entry.owner }, function (err, result){
      var _wallet = result[0];
      // perform a deposit back into the wallet
      wallet.deposit({ id: _wallet.id, currency: entry.currency, amount: entry.amount.toString(), address: 'refund' }, function (err, result){
        if (err) {
          throw err;
        }
      });
    });
  }
}