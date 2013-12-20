//
// /withdrawals/index.js - moves coins from accounts payable "hot-wallet" to non-safe wallet address ( payable accounts )
//
var withdrawal = {},
config = require('../../config'),
bitcoin = require('bitcoin'),
ledger = require('../ledger').ledger;

withdrawal.start = function (options) {

  ledger.persist(options.datasource);

  //
  // Connection to ledger ( accounts payable ) hot-wallet
  //
  var client = new bitcoin.Client(config[options.currency]);

  // get last transaction where status is "ready" from the ledger
  ledger.find({ status: "ready" }, function (err, result) {
    if (result.length === 0) {
      console.log('no transactions ready');
      return;
    }
    var transaction = result[0];
    // WARNING: it's possible a fatal error could occur between sending the amount and updating the updating the ledger
    // there needs to be a safeguard here to ensure that a double send on the ledger cannot occur
    // if the transaction is valid, send the coins from hot wallet client
    client.cmd('sendtoaddress', transaction.sendTo, transaction.amount, function (err, result) {
      if (err) throw err;
      // After this transaction has been processed,
      // mark the transaction as sent, move to the next transaction
      ledger.get (transaction.id, function (err, result){
        if (err) { throw err; }
        result.status = "sent";
        result.save(function(err, result){
          console.log(err, result);
        })
      });
    });
  });

};

module['exports'] = withdrawal;
