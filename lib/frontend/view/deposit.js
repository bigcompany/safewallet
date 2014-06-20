var explorers = require('../../resources/explorers').explorers;

module['exports'] = function (options, callback) {
  var $ = this.$;

  $(".nav a[href='/deposit']").addClass('active');

  var available = {
    "bitcoin": "Bitcoin",
    "litecoin": "Litecoin",
    "peercoin": "Peercoin",
    "dogecoin": "Dogecoin"
  };

  $('head').append('<link type="text/css" href="deposit.css" rel="stylesheet" />');

  var tmpl = $('.receiving .addesses').clone(),
      link,
      str = ''; 

  Object.keys(available).forEach(function(currency){

    var cell = '';

    if (typeof options.addresses[currency] === "undefined") {
      cell = '<div class="large-9 columns">\
                <p>' + '<a href="/generateAddress?currency=' + currency + '">Generate receiving address</a>' + '</p>\
              </div>';
    } else {
      cell = '<div class="large-6 columns">\
                <h4 class="blue bold">Deposit Address:</h4>\
                <p>' + options.addresses[currency]  + '</p>\
              </div>\
              <div class="large-3 columns">\
                <a class="button small radius deposit" href="javascript:drawQrCode(' + "'" + currency + "'" + "," + "'" + options.addresses[currency] + "'" + ');">Show QR Code</a>\
                <canvas height="0" width="0" id="' + currency + 'Canvas" class="qrCanvas">\
              </div>';

    }

    
    var row = '\
      <div class="large-12 column coin-bar big">\
        <div class="row">\
          <div class="large-3 columns align-center">\
            <span class="allcaps"><img src="img/' + currency + '-deposit.png" alt="bitcoins">&nbsp;' + currency + '</span>\
          </div>' + cell + '\
        </div>\
      </div>';


//      str += '<div class="depositCurrency">' + currency.toUpperCase() + '</div>' + '<a href="/generateAddress?currency=' + currency + '">Generate receiving address</a>';
//    } else {
      link = explorers.getLink({ address: options.addresses[currency], currency: currency});
      str += row;
      // str += '<div class="depositCurrency">' + currency.toUpperCase() + '</div><div class="depositAddress">Deposit Address: <a target="_blank" href="' + link + '">' + options.addresses[currency] + '</a></div><canvas id="' + currency + 'Canvas" class="qrCanvas"></canvas><div class="depositQR"><a href="javascript:drawQrCode(' + "'" + currency + "'" + "," + "'" + options.addresses[currency] + "'" + ');">Show QR Code</a></div>';
  });

  $('.coins-bar').append(str);

  callback(null, $.html());
}