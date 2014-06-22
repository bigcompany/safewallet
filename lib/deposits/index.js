//
// deposit/index.js - moves coins from current "hot-wallet" to remote offline wallet
//
var deposit = {},
agent = require('../monitoring/agent'),
debug = require('debug')('alert'),
config = require('../../config'),
resource = require('resource'),
ledger = require('../resources/ledger').ledger,
user = require('../resources/user'),
wallet = require('../resources/wallet'),
bitcoin = require('bitcoin'),
BigNumber = require('bignumber.js');

ledger.persist(config.datasource);
user.persist(config.datasource);
wallet.persist(config.datasource);

//
// After a deposit is made, add the transaction to ledger
//
require('../frontend/hooks/after-deposit-update-ledger');

//
// After a deposit is made, notify the wallet owner with an email
//
require('../frontend/hooks/email-user-on-deposit');

deposit.start = function (options) {

  options = options || {};
  options.currency = options.currency || "peercoin";

  debug('starting ' + options.currency + ' deposits script')

  agent.connect({ name: "safewallet-deposits-" + options.currency }, function (err){

    if (err) {
      debug('Unable to connect to monitoring server ' + err.message);
    }

    //
    // Connection to web frontend hot-wallet
    //
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    var client = new bitcoin.Client(config.deposits[options.currency]),
        coldAddress = options.address || config.coldstorage[options.currency][0].public_key;

    //
    // Get all account balances with 1 minimal confirmations
    //
    client.cmd('listaccounts', 1, function (err, accounts){

      if (err) {
        debug(err);
        resource.emit('deposits::error', err);
        repeat(err);
        return;
      }

      function processTransactions (keys) {

        if (keys.length === 0) {
          return repeat();
        }

        var key = keys.pop();
        var account = key,
            amount = new BigNumber(accounts[key] === '' ? 0 : accounts[key]);

        // Don't attempt to send amounts of 0, or from the default "" account
        if (amount.equals(0)) {
          return processTransactions(keys);
        }

        // Apply transaction fee to deposit
        switch (options.currency) {
          case 'dogecoin':
            amount = amount.minus(0.01);
          break;
          case 'litecoin':
            amount = amount.minus(0.01);
          break;
          case 'peercoin':
            amount = amount.minus(0.01);
          break;
          case 'bitcoin':
            amount = amount.minus(0.0001); // TODO: send without fee
          break;
          default:
          break;
        }

        // Not enough of a balance to send ( transaction fee + amount exceeded total balance )
        if (amount.lte(0)) {
          debug('error making deposit. please check blockchain balances');
          resource.emit('deposits::error', 'error making deposit. please check blockchain balances');
          return processTransactions(keys);
        }

        amount = Number(amount);

        resource.emit('deposits::sending', { account: account, amount: amount, address: coldAddress });
        debug('SENDING ' + account + ' ' + amount + ' -> ' + coldAddress);

        client.cmd('sendfrom', account, coldAddress, amount, function (err, result) {
          // sending failed, do not update wallet with deposit
          if (err) {
            debug('ERROR ' + err.message);
            resource.emit('deposits::error', err.message);
            return processTransactions(keys);
          }

          //
          // If outgoing transfer is successful make a deposit into user's wallet
          //
          debug('SENT ' + account + ' ' + amount + ' -> ' + coldAddress);
          resource.emit('deposits::sent', {
            account: account,
            amount: amount,
            address: coldAddress
          });
          wallet.find({ owner: account }, function (err, _wallet) {
            if (err) {
              throw err;
            }
            // TOOD: add deposit address
            wallet.deposit({ id: _wallet[0].id, currency:  options.currency, amount: amount.toString(), address: _wallet[0].receivingAddresses[options.currency] }, function(err, result){
              if (err) {
                resource.emit('deposits::error', err.message);
                return processTransactions(keys);
              }

              debug('DEPOSITED ' + account + ' ' + amount + ' -> ' + coldAddress);
              resource.emit('deposits::deposited', {
                account: account,
                amount: amount,
                address: coldAddress
              });

              processTransactions(keys);
            });
          });
        });
      }

      processTransactions(Object.keys(accounts));

    });

    function repeat (err) {
      // All balances have been processed and moved to cold storage
      // wait a few minutes and exit the process
      // it is assumed that mon ( the process monitor ) will then restart the process
      if (err) {
        debug('Error processing accounts! restarting process in 5 minutes')
      } else {
        debug('All accounts processed. restarting process in 5 minutes')
      }
      setTimeout(function(){
        process.exit();
      }, 300000);
    }

  });


};

module['exports'] = deposit;