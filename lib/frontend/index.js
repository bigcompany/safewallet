var resource = require('resource'),
    config = require('../../config'),
    agent = require('../monitoring/agent'),
    debug = require('debug')('alert'),
    uuid = require('node-uuid'),
    http = require('resource-http'),
    routes = require('./routes'),
    view = require('view'),
    bitcoin = require('bitcoin'),
    wallet = require('../resources/wallet'),
    user = require('../resources/user'),
    email = require('../resources/email'),
    ledger = require('../resources/ledger').ledger,
    message = require('../resources/message').message,
    metrics = require('../resources/metrics').metrics,
    prices = require('../resources/prices').prices;

// Persist all resources to a datasource
wallet.persist(config.datasource);
user.persist(config.datasource);
ledger.persist(config.datasource);
message.persist(config.datasource);
metrics.persist(config.datasource);
prices.persist(config.datasource);

if (process.env.NODE_ENV === "development") {
  // mock email provider for development
  require('../../test/mock/email');
}

exports.clients = {
  bitcoin : new bitcoin.Client(config.deposits.bitcoin),
  dogecoin: new bitcoin.Client(config.deposits.dogecoin),
  litecoin : new bitcoin.Client(config.deposits.litecoin),
  peercoin : new bitcoin.Client(config.deposits.peercoin)
};

// TODO: Upgrade CouchDB SSL Cert from self-signed and remove this line
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

exports.start = function (callback) {

  debug('starting frontend server');

  agent.connect({ name: "safewallet-frontend"}, function (err) {

    if (err) {
      debug.log('Unable to connect to monitoring server ' + err.message)
    }

    http.listen({ port: config.frontend.port, root: __dirname + '/public' }, function (err, app) {
      if (err) { throw err; }

      app.hasAccess = function (req, role) {
        if (typeof req.session.sessionID === 'undefined') {
          if (typeof req.session.prelogin === "undefined") {
            req.session.prelogin = req.url;
          }
          return false;
        }
        if (typeof role !== "undefined" && req.session.role !== role) {
          return false
        }
        return true;
      }

      app.setLogin = function (req, name, role) {
        req.session.sessionID = uuid();
        req.session.role = role;
        req.session.name = name;
        req.session.prelogin = req.session.prelogin || "/wallet";
      }

      view.create({ path: __dirname + "/view" } , function (err, _view) {
        if(err) throw err;
        var addr = app.server.address();
        debug('frontend started http://' + addr.address + ":" + addr.port);
        app.view = _view;
        routes(app);
        callback(err, app);
      });
    });

  });


  /******************************

    HOOKS

    The following event hooks are responsible for much of Safewallet's business logic.

  *******************************/

  //
  // After a new user is created, create a wallet for that user
  //
  require('./hooks/create-wallet-on-signup');

  //
  // After any emails are sent, create a corresponding message
  //
  require('./hooks/create-message-on-email');

  //
  // Before a withdrawal, ensure that wallet isn't locked
  //
  require('./hooks/before-withdrawals-check-for-wallet-lock');

  //
  // Before a deposit calculate the current approximate price
  //
  require('./hooks/before-deposit-calculate-price.js');

  //
  // Before a withdraw calculate the current approximate price
  //
  require('./hooks/before-withdraw-calculate-price.js');

  //
  // Before a ledger update, ensure that the updated entry is valid
  //
  require('./hooks/before-ledger-update-validate-entry');

  //
  // Update wallet balance on blocked transactions ( funds return back to wallet )
  //
  require('./hooks/update-wallet-on-blocked-transaction');

  //
  // After a withdrawal is made, add the transaction to ledger
  //
  require('./hooks/after-withdrawal-update-ledger');

  //
  // After a deposit is made, add the transaction to ledger
  //
  require('./hooks/after-deposit-update-ledger');

  //
  // After a deposit is made, notify the wallet owner with an email
  //
  require('./hooks/email-user-on-deposit');

  //
  // After the ledger is updated, notify the user with an email
  //
  require('./hooks/email-user-on-ledger-update');

  //
  // After a withdrawal request is made, notify the admin with an email
  //
  require('./hooks/email-admin-on-withdrawal-request');

  //
  // Sends the user a welcome email after signing up
  //
  require('./hooks/email-user-on-signup');

  //
  // Email the user if an account reset is requested
  //
  require('./hooks/email-user-on-reset');

  /******************************

    END HOOKS

  *******************************/

};