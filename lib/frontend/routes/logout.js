module['exports'] = function (app) {
  app.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect(301, '/');
  });
};