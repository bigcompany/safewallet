var wallet = require('../../resources/wallet');

wallet.before('withdraw', function (data, next){
  // make sure wallet isnt locked
  wallet.get(data.id, function (err, _wallet){
    if (err) {
      return next(err);
    }
    // can't withdraw from a locked wallet
    if (_wallet.status === "locked") {
      return next(new Error('failure'));
    }
    data.id = _wallet.id;
    next(null, data);
  });
});
