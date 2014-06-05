var tap = require("tap"), 
    request = require('supertest'),
    user = require('../lib/resources/user'),
    wallet = require('../lib/resources/wallet'),
    ledger = require('../lib/resources/ledger').ledger,
    username = "marak",
    transactionID = null,
    receivingAddress = null,
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
    if (err) {
      throw err;
    }
    receivingAddress = _wallet[0].receivingAddresses['bitcoin'];
    wallet.deposit({ id: _wallet[0].id, currency:  'bitcoin', amount: '1.00', address: receivingAddress }, function(err, result){
      t.equal(null, err);
      transactionID = result.transactionID;
      t.end();
    });
  });
});

tap.test("check that a ledger entry has been made", function (t) {
  ledger.find({ transactionID: transactionID }, function(err, results) {
    var entry = results.pop();
    t.equal(entry.amount, "1.00");
    t.equal(entry.currency, "bitcoin");
    t.equal(entry.status, "processed");
    t.equal(entry.address, receivingAddress);
    t.end();
  })
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