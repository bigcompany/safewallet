var resource = require('resource'),
    metrics = resource.define('metrics');

metrics.property('wallets', { type: "number", required: true, default: 0 });
metrics.property('peercoin', { type: "string", required: true, default: "0.00"  });
metrics.property('bitcoin', { type: "string", required: true, default: "0.00"  });
metrics.property('dogecoin', { type: "string", required: true, default: "0.00"  });
metrics.property('dollars', { type: "string", required: true, default: "0.00" });

metrics.timestamps();

exports.metrics = metrics;