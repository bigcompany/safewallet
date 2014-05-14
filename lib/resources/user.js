var user = require('resource-user');

// Extend resource-user by adding additional properties
user.properties({
   "secondEmail": {
       "type": "string",
       "required": false
   },
   "organization": {
       "type": "string"
   },
   "homePhone": {
       "type": "string"
   },
   "workPhone": {
       "type": "string"
   },
   "cellPhone": {
       "type": "string"
   },
   "address1": {
       "type": "string"
   },
   "address2": {
       "type": "string"
   },
   "city": {
       "type": "string"
   },
   "state": {
       "type": "string"
   },
   "zipcode": {
       "type": "string"
   },
   "country": {
       "type": "string"
   },
   "emergencyContact": {
       "type": "string"
   },
   "emailConfirmations": {
       "type": "boolean",
       "required": true,
       "enum": [true, false],
       "default": true
   },
   "phoneConfirmations": {
       "type": "boolean",
       "required": true,
       "enum": [true, false],
       "default": false
   }
});

user.timestamps();

module['exports'] = user;
