var monitor = {},
    mesh = require('resource-mesh').mesh;

monitor.start = function () {

  mesh.listen({ port: 7777 }, function(){
    debug('monitoring server started');
    mesh.onAny(filterEvents);
  });

  function filterEvents (data) {
    var important = [
    "deposits::error",
    "deposits::sent",
    "deposits::sending",
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
      console.log(JSON.stringify({
        time: new Date(),
        service: data.name,
        event: this.event,
        data: data.payload
      }, true));
    }

  }
};

module['exports'] = monitor;