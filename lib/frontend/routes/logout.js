var debug = require('debug')('alert');

module['exports'] = function (app) {
  app.get('/logout', function(req, res, next) {
    debug('logout successful ' + req.connection.remoteAddress + ' ' + req.session.name);
    req.session.destroy();
    res.redirect(301, '/');
  });
};