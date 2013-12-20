var ledger = require('../../resources/ledger'),
    wallet = require('../../resources/wallet');

wallet.after('withdraw', function (data, next){
  // WARNING: it's possible that between the time of a withdrawal and ledger creation that a fatal i/o error might occur
  // there needs to be a safeguard here to ensure that a withdrawal can't be made without a ledger entry being created
  if (data === "failure") {
    return next(null, data);
  }
  ledger.create({ transactionID: uuid(), owner: data.owner, type: data.currency, amount: data.amount, sendTo: "a-b-c-d-1-2-3-4" }, function (err, result) {
    // TODO: add withdraw rollback should ledger creation fail
    if (err) { 
      // if an error occurred making the entry into the ledger, rollback the withdrawal
      return next(err);
    }
    next(null, data);
  });
});
