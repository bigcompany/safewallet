var dateFormat = require('dateformat');

module['exports'] = function (options, callback) {
  var $ = this.$;
  $('.nav').remove();
  $('.githubBadge').remove();
  $('.balances').append('<tr><td>type</td><td>amount</td><td>dollars</td></tr>');
  for(var type in options.balance) {
    $('.balances').append('<tr><td>' + type + '</td><td>' + options.balance[type].amount + '</td>' + '<td>$' + options.balance[type].price + '</td>' + '</tr>')
  }
  callback(null, $.html());
}