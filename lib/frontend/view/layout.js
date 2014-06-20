module['exports'] = function (options, callback) {

  //
  // TODO: this load statement is a bug in the view engine with layouts, please fix
  //
  var $ = this.$.load(this.template);

  if (typeof options.account === 'undefined') {
    $('.profile').remove();
  } else {
    $('.loginBar').remove();
    $(".username").html(options.account);
  }

  callback(null, $.html());
}