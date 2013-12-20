var user = require('../../resources/user'),
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
        return res.end(err.message);
      }
      if (result === "success") {
        // create a new session
        function login (sessionID) {
          req.session.sessionID = sessionID;
          req.session.name = req.resource.params.name;
          // res.cookie('sessionID', sessionID);
          res.redirect(301, '/account');
        }
        login(uuid())
      } else {
        res.end('login failed. try again.')
      }
    });
  });
};