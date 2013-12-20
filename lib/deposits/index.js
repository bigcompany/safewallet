//
// deposit/index.js - moves coins from current "hot-wallet" to remote off-line wallet
//
var deposit = {},
config = require('../../config'),
wallet = require('../resources/wallet'),
bitcoin = require('bitcoin');


wallet.persist(config.datasource);

deposit.start = function (options) {

  options = options || {};
  options.currency = options.currency || "PPC";

  //
  // Connection to web frontend hot-wallet
  //
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  var client = new bitcoin.Client(config[options.currency]),
      coldAddress = options.address || "PRsyinCxhkJ5ib7cWXzqTTYXN7mwJybtA4";

  //
  // Get all account balances with 5 minimal confirmations
  //
  client.cmd('listaccounts', 5, function (err, accounts){
    if (err) {
      throw err;
    }

    var callbacks = accounts.length;

    function processTransactions (keys) {

      if (keys.length === 0) {
        return repeat();
      }

      var key = keys.pop();
      var account = key,
          amount = accounts[key];

      // Don't attempt to send amounts of 0, or from the default "" account
      if (amount === 0 || account === "") {
        return processTransactions(keys);
      }

      // Apply transaction fee to deposit
      // PPC fee is 0.1
      // BTC fee is set to 0.00
      switch (options.currency) {
        case 'PPC':
          amount = amount - 0.01;
        break;
        case 'BTC':
          // nothing yet
        break;
        default:
        break;
      }

      // Not enough of a balance to send ( transaction fee + amount exceeded total balance )
      if (amount <= 0) {
        return processTransactions(keys);
      }

      console.log('OUTGOING -> ', coldAddress, amount, account);
      client.cmd('sendfrom', account, coldAddress, amount, function (err, result) {
        if (err) {
          throw err;
        }
        //
        // If outgoing transfer is successful make a deposit into user's wallet
        //
        console.log('SENT -> ', coldAddress, amount, account);
        wallet.find({ owner: account }, function (err, _wallet) {
          if (err) {
            throw err;
          }
          console.log('DEPOSITED -> ', coldAddress, amount, account);
          wallet.deposit({ id: _wallet[0].id, currency:  options.currency, amount: amount }, function(err, result){
            if (err) throw err;
            processTransactions(keys);
          });
        });
      });
    }

    processTransactions(Object.keys(accounts));

  });

  function repeat () {
    // All balances have been processed and moved to cold storage
    // wait a few minutes and start again
    console.log('all accounts processed. restarting process in 5 minutes')
    setTimeout(function(){
      deposit.start(options);
    }, 500000);
  }

};

module['exports'] = deposit;