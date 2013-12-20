module['exports'] = function (options, callback) {

  //
  // TODO: this load statement is a bug in the view engine with layouts, please fix
  //
  var $ = this.$.load(this.template);
  callback(null, $.html());
}