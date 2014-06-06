var ledger = require('../../resources/ledger').ledger,
    wallet = require('../../resources/wallet'),
    uuid = require('node-uuid');

wallet.after('withdraw', function (data, next){
  // WARNING: it's possible that between the time of a withdrawal and ledger creation that a fatal i/o error might occur
  // there needs to be a safeguard here to ensure that a withdrawal can't be made without a ledger entry being created
  if (data === "failure") {
    return next(null, data);
  }
  transactionID =  uuid();
  ledger.create({
    ip: data.ip,
    type: 'withdrawal',
    transactionID: transactionID,
    owner: data.owner,
    currency: data.transaction.currency,
    amount: data.transaction.amount,
    address: data.transaction.address,
    price: data.transaction.price
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
