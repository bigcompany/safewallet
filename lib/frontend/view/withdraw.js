module['exports'] = function (options, callback) {
  var $ = this.$;

  $('head').append('<script type="text/javascript" src="withdraw.js"></script>');

  callback(null, $.html());
};