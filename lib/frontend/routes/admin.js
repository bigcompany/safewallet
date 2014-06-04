var ledger = require('../../resources/ledger').ledger,
    wallet = require('../../resources/wallet'),
    view = require('view').view;

module['exports'] = function (app) {
  app.get('/admin', function (req, res, next) {
    if (!app.hasAccess(req, 'admin')){
      return res.redirect(301, '/account');
    }
    ledger.find({ type: 'withdrawal' }, function(err, _ledger){
      if (err) {
        throw err;
      }
      app.view['admin'].present({ ledger: _ledger, transactionID: req.resource.params.t }, function (err, html){
        res.end(html);
      });
    });
  });
  app.post('/admin', function (req, res, next) {
    if (!app.hasAccess(req, 'admin')){
      return res.redirect(301, '/account');
    }
    var params = req.resource.params;

    if (params.sudoUser) {
      // login as another user
      app.setLogin(req, params.sudoUser, "everyone");
      return res.redirect(301, "/wallet");
    }

    ledger.find({ transactionID: params.transactionID, order: "ctime DESC",}, function (err, results){
      var result = results[0];
      result.status = params.status;
      ledger.update(result, function(err){
        if (err) {
          return res.end(err.message);
        }
        // check for incoming params to update ledger transaction
        return res.redirect(301, req.url);
      });
    });
  });
};