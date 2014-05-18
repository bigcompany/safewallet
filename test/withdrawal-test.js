var tap = require("tap"), 
    request = require('supertest'),
    wallet = require('../lib/resources/wallet'),
    ledger = require('../lib/resources/ledger').ledger,
    username = "marak",
    transactionID = null,
    receivingAddress = null,
    sendingAddress = "1234567890",
    app = null,
    agent = null,
    id = null,
    cookie = null;

tap.test("start safewallet server", function (t) {
  var server = require('../lib/frontend');
  server.start(function (err, _app) {
    t.error(err, 'no error');
    t.ok(_app, 'server is returned');
    app = _app;
    agent = request.agent(app);
    
    t.end();
  });
});

tap.test("make a mock deposit into the wallet", function (t) {
  wallet.find({ owner: username }, function (err, _wallet) {
    if (err) {
      throw err;
    }
    wallet.deposit({ id: _wallet[0].id, currency:  'bitcoin', amount: '1.00' }, function(err, result){
      t.equal(null, err);
      t.end();
    });
  });
});

tap.test("make a mock withdrawal from the wallet", function (t) {
  wallet.find({ owner: username }, function (err, _wallet) {
    if (err) {
      throw err;
    }
    wallet.withdraw({ id: _wallet[0].id, currency:  'bitcoin', amount: '0.001', address: sendingAddress }, function (err, result){
      t.equal(null, err);
      transactionID = result.transactionID;
      t.end();
    });
  });
});

tap.test("check that a ledger entry has been made", function (t) {
  ledger.find({ transactionID: transactionID }, function(err, results) {
    var entry = results.pop();
    t.equal(entry.amount, "0.001");
    t.equal(entry.currency, "bitcoin");
    t.equal(entry.status, "pending");
    t.equal(entry.address, sendingAddress);
    t.end();
  })
});


tap.test("shut down the server", function (t) {
  app.server.close(function(){
    t.end();
  });
});