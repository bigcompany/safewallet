var message = require('../../resources/message').message,
    request = require('request'),
    BigNumber = require('bignumber.js');

module['exports'] = function (app) {
  app.get('/messages', function (req, res, next){

    if (!app.hasAccess(req)) {
      return res.redirect(301, '/login');
    }

    message.find({ to: req.session.name }, function (err, messages){
      app.view['messages'].present({
        account: req.session.name,
        m: req.resource.params.m,
        messages: messages 
      }, function (err, html){
        res.end(html);
      });
    });
  });
};