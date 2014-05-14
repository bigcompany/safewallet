module['exports'] = function (options, callback) {
  var $ = this.$;

  $(".nav a[href='/deposit']").addClass('active');

  var available = {
    "dogecoin": "Dogecoin",
    "peercoin": "Peercoin",
    "bitcoin": "Bitcoin"
  };

  $('head').append('<link type="text/css" href="deposit.css" rel="stylesheet" />');

  var tmpl = $('.receiving .addesses').clone(),
      str = '';

  Object.keys(available).forEach(function(currency){
    if (typeof options.addresses[currency] === "undefined") {
      str += '<div>';
        str += '<div><a class="generateButton" href="/generateAddress?currency=' + currency + '">Generate receiving address for ' + available[currency] + ' (' + currency + ')</a></div>';
      str += '</div><br/><br/>';
    } else {
      str += '<strong>' + available[currency] + ' (' + currency + ') receiving address: </strong>' + options.addresses[currency] + '<br/><br/>';
    }
  });

  $('.receiving').html(str);

  callback(null, $.html());
}