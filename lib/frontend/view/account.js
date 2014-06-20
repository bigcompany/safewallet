module['exports'] = function (options, callback) {

  var $ = this.$;

  $(".nav a[href='/account']").addClass('active');
  $("input[name='username']").attr('value', options.data.name);

  var boot = { "data": options.data };
  boot.data.password = "";
  boot.data.confirmPassword = "";
  boot.data.salt = "";

  $('head').append('<script type="text/javascript" src="account.js"></script>');
  $('head').append('<link type="text/css" href="account.css" rel="stylesheet" />');
  $('head').append('<script type="text/javascript">var boot = ' + JSON.stringify(boot, true, 2) + ';</script>');

  if (options.updated) {
    $('.large-12').append('<h3>Updated!</h3>')
  }

  var balance = '$' + options.balance.replace(/\d(?=(\d{3})+\.)/g, '$&,');
  $("#balanceSelect").append("<option>" + balance + "</option>");

  // bind form data
  for(var p in options.data) {
    var el = $('input[name="' + p + '"]');
    if(el.length > 0) {
      if(typeof options.data[p] !== 'undefined' && options.data[p].length > 0) {
        el.attr('value', options.data[p]);
      }
    }
  }

  callback(null, $.html());
}