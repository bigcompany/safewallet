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
        // create a new session
        function login (sessionID) {
          req.session.sessionID = sessionID;
          req.session.name = req.resource.params.name;
          debug('login successful ' + req.connection.remoteAddress + ' ' + req.resource.params.name);
          res.redirect(301, '/wallet');
        }
        login(uuid())
      } else {
        debug('failed login ' + req.connection.remoteAddress + ' ' + req.resource.params.name);
        res.end('login failed. try again.')
      }
    });
  });
};