var tap = require("tap"), 
    request = require('supertest'),
    app = null,
    wallet = require('../lib/resources/wallet'),
    user = require('../lib/resources/user'),
    username = "marak",
    agent = null,
    id = null,
    cookie = null;

require('./mock/email');
require('./mock/prices');

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
    .send({ name: username, password: "foo", confirmPassword: "foo" })
    .expect(301)
    .end(function(err, res){
      cookie = res.headers['set-cookie'];
      t.equal(null, err);
      t.equal(res.text, "Moved Permanently. Redirecting to /wallet");
      t.end();
  });
});

tap.test("try to get /account page while logged in ( with session from signup )", function (t) {
  agent
    .get('/account')
    .set('cookie', cookie)
    .expect(200)
    .end(function(err, res) {
      t.equal(null, err);
      t.end();
  });
});

tap.test("try to get /wallet page while logged in ( with session from signup )", function (t) {
  agent
    .get('/wallet')
    .set('cookie', cookie)
    .expect(200)
    .end(function(err, res) {
      t.equal(null, err);
      t.end();
  });
});

tap.test("logout of the current session", function (t) {
  agent
    .get('/logout')
    .set('cookie', cookie)
    .expect(301)
    .end(function(err, res) {
      t.equal(null, err);
      t.end();
  });
});

tap.test("try to signup another user with the same name", function (t) {
  agent
    .post('/signup')
    .send({ name: username, password: "bar", confirmPassword: "bar" })
    .expect(200)
    .end(function(err, res) {
      t.equal(null, err);
      t.equal(res.text, 'user name is unavailable.');
      t.end();
  });
});

tap.test("try to get /account page with expired cookie", function (t) {
  agent
    .get('/account')
    .set('cookie', cookie)
    .expect(301)
    .end(function(err, res) {
      t.equal(null, err);
      t.end();
  });
});

tap.test("try to get /wallet page with expired cookie", function (t) {
  agent
    .get('/wallet')
    .set('cookie', cookie)
    .expect(301)
    .end(function(err, res) {
      t.equal(null, err);
      t.end();
  });
});

tap.test("try to log in with the first user - wrong password", function (t) {
  agent
    .post('/login')
    .send({ name: username, password: "1234" })
    .expect(200)
    .end(function(err, res) {
      t.equal(res.text, "login failed. try again.");
      t.equal(null, err);
      t.end();
  });
});

tap.test("try to log in with the first user - no password", function (t) {
  agent
    .post('/login')
    .send({ name: username, password: "" })
    .expect(200)
    .end(function(err, res) {
      t.equal(null, err);
      t.end();
  });
});

tap.test("try to log in with the first user - correct password", function (t) {
  agent
    .post('/login')
    .send({ name: username, password: "foo" })
    .expect(301)
    .end(function(err, res) {
      cookie = res.headers['set-cookie'];
      t.equal(null, err);
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
    process.exit(0);
  });
});