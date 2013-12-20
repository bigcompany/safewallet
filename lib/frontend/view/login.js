module['exports'] = function (options, callback) {
  var $ = this.$;
  var boot = {  };

  $('.nav').html('<a href="/signup">signup</a> | <a href="/login">login</a>');
  $('head').append('<script type="text/javascript" src="login.js"></script>');
  $('head').append('<link type="text/css" href="login.css" rel="stylesheet" />');
  $('head').append('<script type="text/javascript">var boot = ' + JSON.stringify(boot, true, 2) + ';</script>');
  
  callback(null, $.html());
};