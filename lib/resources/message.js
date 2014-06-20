var resource = require('resource'),
    message = resource.define('message');

message.property('to', { type: "string", required: true });
message.property('from', { type: "string", required: true });
message.property('subject', { type: "string", required: true });
message.property('body', { type: "string", required: true });

message.timestamps();

exports.message = message;