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
    t.type(latestPrice.prices.peercoin, "string");
    t.equal(err, null);
    t.end();
  });
});
