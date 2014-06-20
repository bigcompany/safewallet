var ledger = require('../../resources/ledger').ledger,
    message = require('../../resources/message').message,
    wallet = require('../../resources/wallet'),
    view = require('view').view;

module['exports'] = function (app) {

  app.get('/wallet', function (req, res, next) {

    if (!app.hasAccess(req)) {
      return res.redirect(301, '/login');
    }

    wallet.find({ owner: req.session.name }, function (err, _wallet) {
      if (err) {
        throw err;
      }
      ledger.find({ order: "ctime DESC", owner: req.session.name }, function(err, _ledger) {
        if (err) {
          throw err;
        }
        wallet.getBalance({ owner: req.session.name }, function (err, balance) {

          message.find({ to: req.session.name }, function (err, messages) {
            app.view['wallet'].present({
              wallet: _wallet[0],
              ledger: _ledger,
              balance: balance,
              account: req.session.name,
              messageCount: messages.length
            }, function(err, html) {
              res.end(html);
            });
          });

        });
      });
    });

  });

};