var user = require('../../resources/user'),
    wallet = require('../../resources/wallet');

user.after('create', function (result, next) {
  wallet.create({ owner: result.name }, function (err, result) {
    next(err, result);
  });
});