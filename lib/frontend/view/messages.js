var message = require('../../resources/message').message;

module['exports'] = function (options, callback) {
  var $ = this.$,
      dateFormat = require('dateformat');
  if (options.m) {
    message.find({ id: options.m }, function (err, _messages){
      var _message = _messages[0];
      $('#messages').remove();
      $('#message').html(_message.body);
      callback(null, $.html());
    });
  } else {
    var messages = options.messages;
    messages.forEach(function(_message){
      $('#messages').append('<tr><td>' + dateFormat(_message.ctime, "HH:mm ddd mmm, yyyy") + '</td><td>' + _message.from + '</td><td><a href="/messages?m=' + _message.id + '">' + _message.subject + '</a></td></tr>');
    });
    callback(null, $.html());
  }
};