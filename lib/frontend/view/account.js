module['exports'] = function (options, callback) {

  var $ = this.$;
  
  var boot = { "data": options.data };
  boot.data.password = "";
  boot.data.confirmPassword = "";

  $('head').append('<script type="text/javascript" src="account.js"></script>');
  $('head').append('<link type="text/css" href="account.css" rel="stylesheet" />');
  $('head').append('<script type="text/javascript">var boot = ' + JSON.stringify(boot, true, 2) + ';</script>');

  if (options.updated) {
    $('body').prepend('<h3>Updated!</h3>')
  }

  callback(null, $.html());
}