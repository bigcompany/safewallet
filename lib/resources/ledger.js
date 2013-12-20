var resource = require('resource'),
    ledger = resource.define('ledger');

ledger.property('owner', { type: "string", required: true });
ledger.property('status', { type: "string", required: true, enum: ['pending', 'ready', 'blocked'], default: 'pending' });
ledger.property('transactionID', { type: "string", required: true });
ledger.property('sendTo', { type: "string", required: true });
ledger.property('type', { type: "string", required: true });
ledger.property('amount', { type: "number", required: true });

exports.ledger = ledger;