$(document).ready(function() {

    /**
     * JSON-schema for the form
     *
     * The form schema defines the data types, validation logic and other constraints that need to be satisfied in
     * order for the form to be considered valid.
     *
     * This should follow the JSON-schema convention.
     * @see http://json-schema.org
     *
     * Full schema settings are listed here:
     * @see http://www.alpacajs.org
     *
     */
    var schema = {
        "properties": {
            "currency": {
              "type": "string",
              "required": true,
              "enum": ["bitcoin", "peercoin", "dogecoin"]
            },
            "amount": {
              "type": "string",
              "required": true
            },
            "sendTo": {
              "type": "string",
              "required": true,
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
            "currency": {
                "type": "select",
                "label": "currency:"
            },
            "amount": {
                "type": "text",
                "label": "amount:"
            },
            "sendTo": {
                "type": "text",
                "label": "send to:"
            }
        },
        "renderForm": true,
        "form": {
            "attributes": {
                "method": "POST",
                "action": "/withdraw",
                "enctype": "multipart/form-data"
            },
            "buttons": {
                "submit": {
                      "value": "make withdrawal"
                }
            },
            toggleSubmitValidState: false
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
        "schema": schema,
        "data": {},
        "options": options,
        "postRender": postRenderCallback
    });
});