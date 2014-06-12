var debug = require('debug')('alert'),
    mesh = require('resource-mesh').mesh;

mesh.listen({ port: 7777 }, function(){
  debug('monitoring server started');
  mesh.onAny(filterEvents);
});

function filterEvents (data) {
  var important = [
  "deposits::listaccounts",
  "deposits::error",
  "deposits::sent",
  "deposits::deposited",
  "wallet::deposit",
  "wallet::withdraw",
  "user::auth",
  "user::signup",
  "user::reset",
  "ledger::update",
  "ledger::create"
  ];

  if (important.indexOf(this.event) !== -1) {
    debug(data.name, this.event, data.payload)
  }

}