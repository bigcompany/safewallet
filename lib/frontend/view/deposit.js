var explorers = require('../../resources/explorers').explorers;

module['exports'] = function (options, callback) {
  var $ = this.$;

  $(".nav a[href='/deposit']").addClass('active');

  var available = {
    "bitcoin": "Bitcoin",
    "peercoin": "Peercoin",
    "dogecoin": "Dogecoin"
  };

  $('head').append('<link type="text/css" href="deposit.css" rel="stylesheet" />');

  var tmpl = $('.receiving .addesses').clone(),
      link,
      str = '';

  Object.keys(available).forEach(function(currency){
    str += '<div class="address ' + currency + '">';
    if (typeof options.addresses[currency] === "undefined") {
      str += '<div class="depositCurrency">' + currency.toUpperCase() + '</div>' + '<a href="/generateAddress?currency=' + currency + '">Generate receiving address</a>';
    } else {
      link = explorers.getLink({ address: options.addresses[currency], currency: currency});
      str += '<div class="depositCurrency">' + currency.toUpperCase() + '</div><div class="depositAddress">Deposit Address: <a target="_blank" href="' + link + '">' + options.addresses[currency] + '</a></div><canvas id="' + currency + 'Canvas" class="qrCanvas"></canvas><div class="depositQR"><a href="javascript:drawQrCode(' + "'" + currency + "'" + "," + "'" + options.addresses[currency] + "'" + ');">Show QR Code</a></div>';
    }
    str += '</div>';
  });

  $('.receiving').html(str);

  callback(null, $.html());
}