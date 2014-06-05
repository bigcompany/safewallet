var email = require("../../lib/resources/email"),
    colors = require('colors');

email.method('send', function(data, callback){
  console.log("===============================================");
  console.log("EMAIL MOCK DETECTED OUTGOING EMAIL MESSAGE".yellow);
  console.log("to: ".grey + data.to.grey);
  console.log("from: ".grey + data.from.grey);
  console.log("subject: ".grey + data.subject.grey);
  console.log("===============================================");
  console.log(data.html || data.text);
  console.log("===============================================");
  console.log("END MESSAGE".yellow);
  console.log("===============================================");
  callback(null, data);
});
