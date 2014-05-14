var tap = require("tap"), 
    request = require('supertest'),
    wallet = require('../lib/resources/wallet'),
    username = "marak",
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

tap.test("try to log in", function (t) {
  request(app)
    .post('/login')
    .send({ name: username, password: "foo" })
    .expect(301)
    .end(function(err, res) {
      console.log(err, res.text)
      cookie = res.headers['set-cookie'];
      t.equal(null, err);
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

tap.test("attempt withdrawal from the account", function (t) {
  agent
    .post('/withdraw')
    .set('cookie', cookie)
    .send({ currency: 'bitcoin', amount: "0.001" })
    .expect(301)
    .end(function(err, res) {
      t.equal(res.text, "Moved Permanently. Redirecting to /wallet");
      t.equal(null, err);
      t.end();
  });
});

tap.test("shut down the server", function (t) {
  app.server.close(function(){
    t.end();
  });
});