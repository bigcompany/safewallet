module['exports'] = function (options, callback) {
  var $ = this.$;
  $('.nav').html('<a href="/signup">signup</a> | <a href="/login">login</a>');
  callback(null, $.html());
}