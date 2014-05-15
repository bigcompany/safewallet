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
      str = '';

  Object.keys(available).forEach(function(currency){
    if (typeof options.addresses[currency] === "undefined") {
      str += '<div class="address">';
        str += '<input type="submit" class="generateButton" name="currency" value = "' + currency + '"/>';
      str += '</div>';
    } else {
      str += '<strong>' + currency + ' deposit address: </strong>' + options.addresses[currency] + '<br/><br/>';
    }
  });

  $('.receiving').html(str);

  callback(null, $.html());
}