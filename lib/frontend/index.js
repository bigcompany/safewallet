var resource = require('resource'),
    config = require('../../config'),
    uuid = require('node-uuid'),
    http = require('resource-http'),
    routes = require('./routes'),
    view = require('view'),
    bitcoin = require('bitcoin'),
    wallet = require('../resources/wallet'),
    user = require('../resources/user'),
    ledger = require('../resources/ledger').ledger;

// Persist all resources to a datasource
wallet.persist(config.datasource);
user.persist(config.datasource);
ledger.persist(config.datasource);

exports.clients = {
  PPC : new bitcoin.Client(config.ppcoin),
  BTC : new bitcoin.Client(config.bitcoin)
};

// TODO: Upgrade CouchDB SSL Cert from self-signed and remove this line
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

exports.start = function (callback) {

  // TODO: connect to BTC as well
  http.listen({ port: config.frontend.port, root: __dirname + '/public' }, function (err, app) {
    if (err) { throw err; }
    view.create({ path: __dirname + "/view" } , function (err, _view) {
      if(err) throw err;
      app.view = _view;
      routes(app);
      callback(err, app);
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
  // Before a withdrawal, ensure that wallet isn't locked
  //
  require('./hooks/before-withdrawals-check-for-wallet-lock');

  //
  // After a withdrawal is made, move the transaction to ledger
  //
  require('./hooks/update-ledger-on-withdrawal');

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