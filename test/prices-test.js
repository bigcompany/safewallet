var tap = require("tap"), 
    request = require('supertest'),
    config = require('../config'),
    user = require('../lib/resources/user'),
    prices = require('../lib/resources/prices').prices;

prices.persist(config.datasource);

tap.test("attempt to fetch prices from live feeds", function (t) {
  prices.fetch(function (err, _prices) {
    if (err) {
      throw err;
    }
  t.equal(err, null);
  t.type(_prices, Object);
  t.type(_prices.prices.bitcoin, "string");
  t.type(_prices.prices.dogecoin, "string");
  t.type(_prices.prices.litecoin, "string");
  t.type(_prices.prices.peercoin, "string");
  t.end();
  });
});

tap.test("attempt to get last price from datasource", function (t) {
  prices.latest(function (err, latestPrice) {
    if (err) {
      throw err;
    }
    t.type(latestPrice, Object);
    t.type(latestPrice.prices.bitcoin, "string");
    t.type(latestPrice.prices.dogecoin, "string");
    t.type(latestPrice.prices.litecoin, "string");
    t.type(latestPrice.prices.peercoin, "string");
    t.equal(err, null);
    t.end();
  });
});

tap.test("attempt to calculate a price", function (t) {
  prices.calculate({ currency: 'bitcoin', amount: '100' }, function (err, result){
    t.equal(null, err);
    t.type(result.currency, "string");
    t.type(result.total, "string");
    t.end();
  });
});

tap.test("attempt to calculate a price with invalid amount", function (t) {
  prices.calculate({ currency: 'bitcoin', amount: 'abc' }, function (err, result){
    t.type(err, "object");
    t.end();
  });
});
