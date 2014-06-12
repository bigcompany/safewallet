var agent ={},
    debug = require('debug')('alert'),
    resource = require('resource'),
    mesh = require('resource-mesh').mesh;

agent.connect = function (options, callback){
  mesh.connect({ port: options.port }, function (err, node){
    if (err) {
      debug('Unable to connect to monitoring server');
      callback(err, node);
      return;
    }
    debug('monitoring agent connected');
    resource.onAny(function (data){
      mesh.emit(this.event, { 
        name: options.name,
        payload: data 
      });
    });
    callback(null, node);
  });
};

module['exports'] = agent;