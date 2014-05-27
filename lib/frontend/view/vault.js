var dateFormat = require('dateformat'),
    metrics = require('../../resources/metrics').metrics;

module['exports'] = function (options, callback) {
  var $ = this.$;
  $('.nav').remove();
  $('.githubBadge').remove();
  $('.balances').append('<tr><td>type</td><td>amount</td><td>price</td><td>dollar value</td></tr>');
  var totals = options.balance.totals,
      prices = options.balance.prices;

  metrics.all(function(err, _metrics){
    var boot = {
      data: _metrics
    };
    $('head').append('<script type="text/javascript">var boot = ' + JSON.stringify(boot, true, 2) + ';</script>');

    for(var type in totals) {
      $('.balances').append('<tr><td>' + type + '</td><td>' + totals[type].amount + '</td>' + '<td>$' + (prices[type] || 'unknown') + '</td>' + '<td>$' + totals[type].price + '</td>' + '</tr>')
    }
    callback(null, $.html());
  });
}