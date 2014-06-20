var routes = ['account', 'admin', 'deposit', 'generateAddress', 'login', 'reset', 'logout', 'messages', 'signup', 'vault', 'wallet', 'withdraw'],
   _routes = {};

// require every route listed
routes.forEach(function(route){
  _routes[route] = require('./routes/' + route);
});

module['exports'] = function addRoutes (app) {
  app.get('/', function(req, res) {
      app.view['index'].present({
        account: req.session.name
      }, function(err, html) {
        res.end(html);
      });
  });
  // add required routes to the app
  routes.forEach(function(route){
    _routes[route](app);
  });
}