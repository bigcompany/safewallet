var routes = ['account', 'deposit', 'generateAddress', 'login', 'reset', 'logout', 'signup', 'vault', 'wallet', 'withdraw'],
   _routes = {};

// require every route listed
routes.forEach(function(route){
  _routes[route] = require('./routes/' + route);
});

module['exports'] = function addRoutes (app) {
  app.get('/', function(req, res) {
    if (req.session.sessionID) {
      res.redirect(301, '/account');
    } else {
      app.view['index'].present({}, function(err, html) {
        res.end(html);
      });
    }
  });
  // add required routes to the app
  routes.forEach(function(route){
    _routes[route](app);
  });
}