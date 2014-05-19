var debug = require('debug')('alert'),
    user = require('../../resources/user'),
    uuid = require('node-uuid'),
    view = require('view').view;

module['exports'] = function (app) {

  app.get('/reset', function(req, res, next) {
    // If token has been provided check if it is valid and attempt to bypass password
    if (req.resource.params.token && req.resource.params.token.length > 0) {
      user.find({ token: req.resource.params.token }, function(err, result){
        if(err) {
          return res.end(err.message);
        }
        if (result.length === 0) {
          return res.end('Invalid account token');
        }
        req.session.sessionID = uuid();
        req.session.name = result[0].name;
        debug('password reset for ' + req.session.name);
        // TODO: We could invalidate / regenerate user.token here to make login tokens one-time use only
        return res.redirect(301, '/account');
      });
    } else {
      app.view['reset'].present({}, function(err, html){
        res.end(html);
      });
    }
  });

  app.post('/reset', function(req, res, next) {
    user.reset(req.resource.params, function (err, result){
      if (err) {
        return res.end(err.message);
      }
      if (typeof result.email === "undefined" || result.email.length === 0) {
        return res.end('unable to reset account. no email is on file for account: ' + result.name);
      } else {
        return res.end('reset successful. an email has been sent to: ' + result.email + ' with further instructions.');
      }
    });
  });

};