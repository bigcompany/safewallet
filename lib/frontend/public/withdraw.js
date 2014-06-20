var schema = {
  "properties": {
      "currency": {
        "type": "string",
        "required": true,
        "enum": ["bitcoin", "litecoin", "peercoin", "dogecoin"]
      },
      "amount": {
        "type": "string",
        "required": true
      },
      "address": {
        "type": "string",
        "required": true,
      }
  }
};
