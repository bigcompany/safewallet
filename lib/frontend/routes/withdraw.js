var wallet = require('../../resources/wallet'),
    view = require('view').view;

module['exports'] = function (app) {

  app.get('/withdraw', function(req, res, next) {

    if (typeof req.session.sessionID === 'undefined') {
      return res.redirect(301, '/login');
    }

    app.view['withdraw'].present({}, function(err, html){
      res.end(html);
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
      wallet.withdraw({ ip: req.connection.remoteAddress, id: result[0].id, currency: req.resource.params.currency, amount: req.resource.params.amount }, function (err, result) {
        console.log('couldnt withdraw', err)
        if (err) {
          return res.end(JSON.stringify(result, true, 2));
        }
        if (result === 'failure') {
          return res.end('failure');
        }
        return res.redirect(301, '/wallet');
      });
    });
  });
  
};