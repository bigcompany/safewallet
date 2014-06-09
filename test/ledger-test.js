var tap = require("tap"), 
    request = require('supertest'),
    user = require('../lib/resources/user')
    wallet = require('../lib/resources/wallet'),
    ledger = require('../lib/resources/ledger').ledger,
    username = "marak",
    transactionID = null,
    receivingAddress = null,
    entry = null,
    sendingAddress = "1234567890",
    app = null,
    agent = null,
    id = null,
    cookie = null;

require('./mock/email');

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

tap.test("signup with a new user", function (t) {
  request(app)
    .post('/signup')
    .send({ name: username, email: "dev-safewallet@marak.com", password: "foo", confirmPassword: "foo" })
    .expect(301)
    .end(function(err, res){
      cookie = res.headers['set-cookie'];
      t.equal(null, err);
      t.equal(res.text, "Moved Permanently. Redirecting to /wallet");
      t.end();
  });
});

tap.test("make a mock deposit into the wallet", function (t) {
  wallet.find({ owner: username }, function (err, _wallet) {
    t.equal(null, err);
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
    entry = results.pop();
    t.equal(entry.amount, "0.001");
    t.equal(entry.currency, "bitcoin");
    t.equal(entry.status, "pending");
    t.equal(entry.address, sendingAddress);
    t.end();
  })
});

tap.test("attempt to update ledger entry with duplicate status", function (t) {
  entry.status = "pending";
  ledger.update(entry, function(err, results) {
    t.type(err, Object);
    t.equal(err.message, "Unable to update with duplicate status");
    t.end();
  })
});

tap.test("attempt to update ledger entry status to blocked", function (t) {
  entry.status = "blocked";
  ledger.update(entry, function(err, results) {
    t.equal(null, err);
    // TODO: fix issue here with test suite running cleanup before hooks execute
    setTimeout(function(){
      t.end();
    }, 2000);
  })
});

tap.test("check that a ledger entry has been made for the refund", function (t) {
  ledger.find({ address: 'refund' }, function(err, results) {
    entry = results.pop();
    t.equal(entry.amount, "0.001");
    t.equal(entry.currency, "bitcoin");
    t.equal(entry.status, "processed");
    t.end();
  })
});

tap.test("check that the wallet balance has been updated", function (t) {
  wallet.find({ owner: username }, function (err, wallets) {
    t.equal(null, err);
    var _wallet = wallets[0];
    t.equal(_wallet.currencies.bitcoin.amount, '1');
    t.end();
  });
});

tap.test("clean up - destroy test user", function (t) {
  user.find({ name: username }, function(err, _user){
   _user[0].destroy(function(){
     t.end();
   });
  });
});

tap.test("clean up - destroy test wallet", function (t) {
  wallet.find({ owner: username }, function(err, _wallet){
   _wallet[0].destroy(function(){
     t.end();
   });
  });
});

tap.test("shut down the server", function (t) {
  app.server.close(function(){
    t.end();
  });
});