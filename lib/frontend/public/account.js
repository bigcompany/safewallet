var schema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "email": {
            "type": "string",
            "required": false
        },
        "secondEmail": {
            "type": "string",
            "required": false
        },
        "password": {
            "type": "string"
        },
        "confirmPassword": {
            "type": "string"
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
        }
        /*,
        "emailConfirmations": {
            "type": "boolean",
            "required": true,
            "default": true
        },
        "phoneConfirmations": {
            "type": "boolean",
            "required": true,
            "default": false
        }*/
    }
};