var wallet = require('../../resources/wallet'),
    view = require('view').view;

module['exports'] = function (app) {
  app.get('/deposit', function (req, res, next) {
     if (typeof req.session.sessionID === 'undefined') {
       return res.redirect(301, '/login');
     }
     wallet.find({ owner: req.session.name }, function (err, result) {
       var record = result[0];
       app.view['deposit'].present({ addresses: record.receivingAddresses }, function (err, html){
         res.end(html);
       });
     });
   });
};