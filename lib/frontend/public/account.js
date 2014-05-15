$(document).ready(function() {

    /**
     * JSON-schema for the form
     *
     * The form schema defines the data types, validation logic and other constraints that need to be satisfied in
     * order for the form to be considered valid.
     *
     * Full schema settings are listed here:
     * @see http://www.alpacajs.org
     *
     */
    var schema = {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "disabled": true
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
        }
    };

    /**
     * Layout options for the form
     *
     * These options describe UI configuration for the controls that are rendered for the data and schema.  You can
     * tweak the layout and presentation aspects of the form in this section.
     *
     * Full options settings are listed here:
     * @see http://www.alpacajs.org
     *
     */
    var options = {
        "fields": {
            "name": {
                "type": "text",
                "label": "username:",
                "hidden": true
            },
            "email": {
                "type": "email",
                "label": "email address:",
                "allowOptionalEmpty": true
            },
            "secondEmail": {
                "type": "email",
                "label": "Secondary Email Address:",
                "allowOptionalEmpty": true
            },
            "password": {
                "type": "password",
                "label": "Change Password:",
                "allowOptionalEmpty": true
            },
            "confirmPassword": {
                "type": "password",
                "label": "Confirm Password Change:",
                "allowOptionalEmpty": true
            },
            "organization": {
                "type": "text",
                "label": "Organization:"
            },
            "homePhone": {
                "type": "text",
                "label": "Home phone:",
                "allowOptionalEmpty": true
            },
            "workPhone": {
                "type": "text",
                "label": "Work phone:",
                "allowOptionalEmpty": true
            },
            "cellPhone": {
                "type": "text",
                "label": "Cell phone:",
                "allowOptionalEmpty": true
            },
            "address1": {
                "type": "text",
                "label": "Address:"
            },
            "address2": {
                "type": "text",
                "label": "Address:"
            },
            "city": {
                "type": "text",
                "label": "City:"
            },
            "state": {
                "type": "text",
                "label": "State:"
            },
            "zipcode": {
                "type": "text",
                "label": "Zip/Postal code:"
            },
            "country": {
                "type": "country",
                "label": "Country"
            },
            "emergencyContact": {
                "type": "text",
                "label": "Emergency contact (name and number):"
            },
            "emailConfirmations": {
                "type": "radio",
                "label": "Do you want an email to confirm withdrawals:",
                "optionLabels": ["Yes", "No"]
            },
            "phoneConfirmations": {
                "type": "radio",
                "label": "Do you want a telephone call to confirm withdrawals:",
                "optionLabels": ["Yes", "No"]
            }
        },
        "renderForm": true,
        "form": {
            "attributes": {
                "method": "POST",
                "action": "/account",
                "enctype": "multipart/form-data"
            },
            "buttons": {
                "submit": {
                      "value": "update"
                }
            }
        }
    };

    /**
     * This is an optional post render callback that Alpaca will call once the form finishes rendering.  The form
     * rendering itself is asynchronous as it may load templates or other resources for use in generating the UI.
     *
     * Once the render is completed, this callback is fired and the top-level Alpaca control is handed back.
     *
     * @param control
     */
    var postRenderCallback = function (control) {

    };


    /**
     * Render the form.
     *
     * We call alpaca() with the data, schema and options to tell Alpaca to render into the selected dom element(s).
     */
    $("#form").alpaca({
        "data": boot.data,
        "schema": schema,
        "options": options,
        postRender: postRenderCallback
    });
});