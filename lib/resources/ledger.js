var resource = require('resource'),
    ledger = resource.define('ledger');

ledger.property('owner', { type: "string", required: true });
ledger.property('type', { type: "string", required: true, enum: ["deposit", "withdrawal"] });
ledger.property('status', { type: "string", required: true, enum: ['pending', 'approved', 'blocked', 'processed'], default: 'pending' });
ledger.property('transactionID', { type: "string", required: true });
ledger.property('address', { type: "string", required: false });
ledger.property('currency', { type: "string", required: true });
ledger.property('amount', { type: "string", required: true });
ledger.property('price', { type: "string", required: false });

ledger.property('ip', { type: "string", required: true, default: "0.0.0.0" });

ledger.timestamps();

exports.ledger = ledger;