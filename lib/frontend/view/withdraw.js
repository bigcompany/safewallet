module['exports'] = function (options, callback) {
  var $ = this.$;

  $(".nav a[href='/withdraw']").addClass('active');

  $('head').append('<script type="text/javascript" src="withdraw.js"></script>');

  var balance = '$' + options.balance.replace(/\d(?=(\d{3})+\.)/g, '$&,');
  $("#balanceSelect").append("<option>" + balance + "</option>");

  callback(null, $.html());
};