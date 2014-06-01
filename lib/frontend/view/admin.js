var dateFormat = require('dateformat'),
    explorers = require('../../resources/explorers').explorers;

module['exports'] = function (options, callback) {

  var $ = this.$;

  var html = require('html-lang');

  var ledger = options.ledger;

  var tmpl = $('.ledger').html();

  if (options.transactionID) {
    // get transaction
    var _status = ["pending", "blocked", "approved", "processed"];

    $('#transactionID').attr("value", options.transactionID);

    var entry = ledger.filter(function(item){
      return item.transactionID === options.transactionID;
    });
    entry = entry[0];
    _status.forEach(function(status){
      if (status === entry.status) {
        $('#status').append('<option selected="selected" value="' + entry.status + '">' + entry.status + '</option>');
      } else {
        $('#status').append('<option value="' + status + '">' + status + '</option>');
      }
    });

    var arr = [],
    link,
    dt;
    dt = '<a href="/admin?t='  + entry.transactionID + '">' + dateFormat(new Date(entry.ctime), "HH:mm:ss mmm dd, yyyy") + '</a>';
    link = explorers.getLink({ address: entry.address, currency: entry.currency});
    arr.push({ type: entry.type, ip: entry.ip, owner: entry.owner, date: dt, status: entry.status, address: '<a target="_blank" href="' + link + '">' + entry.address + '</a>', currency: entry.currency, amount: entry.amount });
    arr.unshift({ date: 'date', ip: 'ip', owner: 'owner', type: 'type', status: 'status', address: 'address', currency: 'currency', amount: 'amount' });
    var str = html.render({ transactions: arr }, tmpl);
    $('.entry').html(str);
  } else {
    $('#transaction').html("<p>click on a transaction to edit it's status</p>");
  }

  if (options.ledger.length === 0) {
    $('.ledger').remove();
  } else {
    var arr = [],
    link,
    dt;
    ledger = ledger.reverse();
    ledger.forEach(function(item){
      dt = '<a href="/admin?t='  + item.transactionID + '">' + dateFormat(new Date(item.ctime), "HH:mm:ss mmm dd, yyyy") + '</a>';
      link = explorers.getLink({ address: item.address, currency: item.currency});
      arr.push({ type: item.type, owner: item.owner, ip: item.ip, date: dt, status: item.status, address: '<a target="_blank" href="' + link + '">' + item.address + '</a>', currency: item.currency, amount: item.amount });
    });
    arr.unshift({ date: 'date', ip: 'ip', owner: 'owner', type: 'type', status: 'status', address: 'address', currency: 'currency', amount: 'amount' });
    var str = html.render({ transactions: arr }, tmpl);
    $('.ledger').html(str);
  }
  callback(null, $.html());

};