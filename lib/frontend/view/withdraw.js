module['exports'] = function (options, callback) {
  var $ = this.$;

  $(".nav a[href='/withdraw']").addClass('active');

  $('head').append('<script type="text/javascript" src="withdraw.js"></script>');

  callback(null, $.html());
};