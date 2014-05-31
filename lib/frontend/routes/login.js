var user = require('../../resources/user'),
    debug = require('debug')('alert'),
    uuid = require('node-uuid'),
    view = require('view').view;

module['exports'] = function (app) {

  app.get('/login', function(req, res, next) {
    if (typeof req.session.sessionID !== 'undefined') {
      return res.redirect(301, '/account');
    }
    app.view['login'].present({}, function(err, html){
      res.end(html);
    });
  });

  app.post('/login', function (req, res, next) {
    user.auth(req.resource.params, function (err, result) {
      if (err) {
        debug('error', err.message);
        return res.end(err.message);
      }
      if (result === "success") {
        app.setLogin(req, req.resource.params.name, "everyone");
        // TODO: move to roles system
        if (req.session.name === "marak") {
          req.session.role = "admin";
        }
        debug('login successful ' + req.connection.remoteAddress + ' ' + req.resource.params.name);
        res.redirect(301, req.session.prelogin);
      } else {
        debug('failed login ' + req.connection.remoteAddress + ' ' + req.resource.params.name);
        res.end('login failed. try again.')
      }
    });
  });
};