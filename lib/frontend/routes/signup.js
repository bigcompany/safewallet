var user = require('../../resources/user'),
    debug = require('debug')('alert'),
    view = require('view').view,
    uuid = require('node-uuid');

module['exports'] = function (app) {
  app.get('/signup', function(req, res, next) {
    app.view['signup'].present({}, function(err, html){
      res.end(html);
    });
  });
  app.post('/signup', function(req, res, next) {
    var params = req.resource.params;
    params.status = "active";
    user.signup(params, function (err, result) {
      if (err) {
        return res.end(err.message);
      }
      debug('new user signup! ' + params.name);
      app.setLogin(req, params.name, "everyone");
      res.redirect(301, '/wallet');
    });
  });
};