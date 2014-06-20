var wallet = require('../../resources/wallet'),
    debug = require('debug')('alert'),
    view = require('view').view;

module['exports'] = function (app) {

  app.get('/withdraw', function(req, res, next) {

    if (!app.hasAccess(req)) {
      return res.redirect(301, '/login');
    }

    wallet.getBalance({ owner: req.session.name }, function (err, balance) {
      app.view['withdraw'].present({
        balance: balance,
        account: req.session.name,
      }, function(err, html){
        res.end(html);
      });
    });

  });

  app.post('/withdraw', function(req, res, next) {
    if (typeof req.session.sessionID === 'undefined') {
      return res.redirect(301, '/login');
    }

    wallet.find({ owner: req.session.name }, function (err, result) {
      if (err) {
        return res.end(err.message);
      }
      debug('withdrawal request ' + req.session.name + ' ' +req.resource.params.currency + ' ' + req.resource.params.amount);
      wallet.withdraw({ ip: req.connection.remoteAddress, id: result[0].id, currency: req.resource.params.currency, amount: req.resource.params.amount, address: req.resource.params.address }, function (err, result) {
        if (err) {
          debug('withdrawal request denied ' + req.session.name + ' ' +req.resource.params.currency + ' ' + req.resource.params.amount);
          return res.end(err.message);
        }
        if (result === 'failure') {
          debug('withdrawal request denied ' + req.session.name + ' ' +req.resource.params.currency + ' ' + req.resource.params.amount);
          return res.end('failure');
        }

        debug('withdrawal request pending ' + req.session.name + ' ' +req.resource.params.currency + ' ' + req.resource.params.amount);
        return res.redirect(301, "/wallet");
      });
    });
  });
  
};