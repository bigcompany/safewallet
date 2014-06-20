var dateFormat = require('dateformat'),
    explorers = require('../../resources/explorers').explorers;

module['exports'] = function (options, callback) {
  var $ = this.$;
  
  var html = require('html-lang');

  var ledger = options.ledger;
  
  var tmpl = $('.ledger').html();

  var balance = '$' + options.balance.replace(/\d(?=(\d{3})+\.)/g, '$&,');
  $("#balanceSelect").append("<option>" + balance + "</option>");

  $(".username").html(options.account);

  $(".nav a[href='/wallet']").addClass('active');
  $(".message-box").html(options.messageCount);
  $(".walletBalance").html(balance);
  var today = new Date(),
      hour = today.getHours(),
      part;

  if (hour<12){
    part = "Good Morning";
  } else if(hour<15){
    part = "Good Afternoon";
  } else{
    part = "Good Evening";
  }

  $(".welcomeGreeting").html(part + " &nbsp;&nbsp;");

  var dt = dateFormat(new Date(), "ddd mmm dd, yyyy HH:mm:ss ");
  $(".clock .time").html('&nbsp;&nbsp; &nbsp;' + dt);
  var currencies = options.wallet.currencies;

  if (Object.keys(currencies).length === 0) {
    var row = '\
       <div class="large-12 column coin-bar">\
          <div class="row">\
            <div class="large-12 columns align-left">\
              <a class="deposit button small radius" href="/deposit">MAKE A DEPOSIT</a>\
            </div>\
          </div><!--row coin bar-->\
        </div>\
       </div>';
    // $('.coins-bar').append("<tr><td>no coins have been deposited yet! <a class='deposit' href='/deposit'>try making a deposit</a></td></tr>");
    $('.coins-bar').append(row);

  } else {
    for (var c in currencies) {
      // $('.coins-bar').append('<tr><td>' + c + '</td><td> ' + currencies[c].amount + '</td></tr>');
      var row = '\
         <div class="large-12 column coin-bar">\
            <div class="row">\
              <div class="large-3 columns align-left">\
                <img src="img/' + c + '.png" alt="namecoins">&nbsp;' + c + '\
              </div>\
              <div class="large-9 columns">\
                <span class="blue size22">' + currencies[c].amount  + '&nbsp;<span class="size18 grey">coins</span>\
              </span></div>\
            </div><!--row coin bar-->\
          </div>\
         </div>';
      $('.coins-bar').append(row);

    }
  }

  if (options.ledger.length === 0) {
    $('.ledger').remove();
  } else {
    var dt, link, str = '';
    ledger.forEach(function(item){
      var cssClass = ''
      if(item.status === "blocked") {
        cssClass = 'class="red"';
      }
      dt = dateFormat(new Date(item.ctime), "HH:mm:ss mmm dd, yyyy");
      link = explorers.getLink({ address: item.address, currency: item.currency});
      var row = '\
        <tr ' + cssClass + '>\
          <td><a href="#">' + dt + '</a></td>\
          <td>' + item.type + '</td>\
          <td>' + item.status + '</td>\
          <td>' + item.currency + '</td>\
          <td>' + item.amount + '</td>\
          <td>' + item.address + '</td>\
        </tr>';
      str += row;
      // arr.push({ type: item.type, date: dt, status: item.status, address: '<a target="_blank" href="' + link + '">' + item.address + '</a>', currency: item.currency, amount: item.amount });
    });
    $('.ledger').append(str);
  }
  callback(null, $.html());
}