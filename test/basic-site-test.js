var tap = require("tap"), 
    request = require('supertest'),
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

tap.test("signup with a new user", function (t) {
  request(app)
    .post('/signup')
    .send({ name: 'marak', password: "foo", confirmPassword: "foo" })
    .expect(301)
    .end(function(err, res){
      cookie = res.headers['set-cookie'];
      t.equal(null, err);
      t.equal( "Moved Permanently. Redirecting to /account", res.text);
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
    .send({ name: 'marak', password: "bar", confirmPassword: "bar" })
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
    .send({ name: 'marak', password: "1234" })
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
    .send({ name: 'marak', password: "" })
    .expect(200)
    .end(function(err, res) {
      t.equal(null, err);
      t.equal(res.text, "login failed. try again.");
      t.end();
  });
});

tap.test("try to log in with the first user - correct password", function (t) {
  agent
    .post('/login')
    .send({ name: 'marak', password: "foo" })
    .expect(301)
    .end(function(err, res) {
      cookie = res.headers['set-cookie'];
      t.equal(null, err);
      t.end();
  });
});

tap.test("shut down the server", function (t) {
  app.server.close(function(){
    t.end();
  });
});