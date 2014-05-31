var ledger = require('../../resources/ledger').ledger,
    wallet = require('../../resources/wallet'),
    uuid = require('node-uuid');

wallet.after('deposit', function (data, next){
  // WARNING: it's possible that between the time of a deposit and ledger creation that a fatal i/o error might occur
  // there needs to be a safeguard here to ensure that a deposit can't be made without a ledger entry being created
  if (data === "failure") {
    return next(null, data);
  }
  var transactionID = uuid();
  ledger.create({ 
    ip: data.ip, 
    type: 'deposit', 
    transactionID: transactionID,
    owner: data.owner,
    status: 'processed',
    address: data.receivingAddresses[data.transaction.currency],
    currency: data.transaction.currency,
    amount: data.transaction.amount
    }, function (err, result) {
    // TODO: add withdraw rollback should ledger creation fail
    if (err) { 
      // if an error occurred making the entry into the ledger, rollback the withdrawal
      return next(err);
    }
    data.transactionID = transactionID;
    next(null, data);
  });
});
