var dateFormat = require('dateformat');

module['exports'] = function (options, callback) {
  var $ = this.$;
  
  var html = require('html-lang');

  var ledger = options.ledger;
  
  var tmpl = $('.ledger').html();

  $(".nav a[href='/wallet']").addClass('active');

  var currencies = options.wallet.currencies;

  if (Object.keys(currencies).length === 0) {
    $('.currencies').append("<tr><td>no coins have been deposited yet! <a class='deposit' href='/deposit'>try making a deposit</a></td></tr>");
  } else {
    $('.currencies').append('<tr><td>currency</td><td>amount</td></tr>');
    for (var c in currencies) {
      $('.currencies').append('<tr><td>' + c + '</td><td> ' + currencies[c].amount + '</td></tr>');
    }
  }

  if (options.ledger.length === 0) {
    $('.ledger').remove();
  } else {
    var arr = [],
    dt;
    ledger.forEach(function(item){
      dt = dateFormat(new Date(item.ctime), "HH:mm:ss mmm dd, yyyy");
      arr.push({ type: item.type, date: dt, status: item.status, sendTo: item.sendTo, currency: item.currency, amount: item.amount });
    });
    arr.unshift({ date: 'date', type: 'type', status: 'status', sendTo: 'sending to', currency: 'currency', amount: 'amount' });
    var str = html.render({ transactions: arr }, tmpl);
    $('.ledger').html(str);
  }
  callback(null, $.html());
}