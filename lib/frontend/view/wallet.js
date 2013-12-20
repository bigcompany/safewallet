module['exports'] = function (options, callback) {
  var $ = this.$;
  
  var html = require('html-lang');

  var ledger = options.ledger;
  
  var tmpl = $('.ledger').html();
  
  $('.status').html(options.wallet.status);

  var currencies = options.wallet.currencies;
  
  if (Object.keys(currencies).length === 0) {
    $('.currencies').html("0.00000000");
  } else {
    $('.currencies').html(JSON.stringify(options.wallet.currencies, true, 2));
  }


  if (options.ledger.length === 0) {
    $('.ledger').remove();
  } else {
    var arr = []
    ledger.forEach(function(item){
      arr.push({ status: item.status, sendTo: item.sendTo, currency: item.type, amount: item.amount });
    });
    var str = html.render({ transactions: arr }, tmpl);
    $('.ledger').html(str);
  }
  callback(null, $.html());
}