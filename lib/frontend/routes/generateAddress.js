var wallet = require('../../resources/wallet'),
    view = require('view').view;

module['exports'] = function (app) {
  var clients = require('../').clients;
  app.get('/generateAddress', function (req, res, next) {
     if (typeof req.session.sessionID === 'undefined') {
       return res.redirect(301, '/login');
     }
     var currency = req.resource.params.currency;
     wallet.find({ owner: req.session.name }, function (err, _wallet) {
       if (err) {
         res.end(err.message);
       }
       var record = _wallet[0];
       if (typeof record.receivingAddresses[currency] === "undefined") {
         clients[currency].cmd('getnewaddress', record.owner, function (err, result){
           if (err) {
             return res.end(err.message);
           }
            wallet.generateAddress({ id: record.id, owner: record.owner, type: currency, publicKey: result }, function (err, address) {
              if (err) {
                return res.end(err.message);
              }
              return res.redirect(301, '/deposit');
           });
         });
       } else {
         res.end('address: ' + record.receivingAddresses[options.type]  + ' is already on-file. will not generate a new address.')
       }
     });
   });
};