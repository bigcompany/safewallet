module['exports'] = function (options, callback) {
  var $ = this.$;
  $('.nav').html('<a href="/signup">signup</a> | <a href="/login">login</a>');
  $('head').append('<script type="text/javascript" src="reset.js"></script>');

  callback(null, $.html());
};