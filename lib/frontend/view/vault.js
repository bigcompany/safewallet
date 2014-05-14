var dateFormat = require('dateformat');

module['exports'] = function (options, callback) {
  var $ = this.$;
  $('.nav').remove();
  $('.githubBadge').remove();
  $('.balances').append('<tr><td>type</td><td>amount</td><td>price</td><td>dollar value</td></tr>');
  var totals = options.balance.totals,
      prices = options.balance.prices;
  for(var type in totals) {
    $('.balances').append('<tr><td>' + type + '</td><td>' + totals[type].amount + '</td>' + '<td>$' + (prices[type] || 'unknown') + '</td>' + '<td>$' + totals[type].price + '</td>' + '</tr>')
  }
  callback(null, $.html());
}