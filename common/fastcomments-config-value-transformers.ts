import {FastCommentsSSO} from "./fastcomments-config-interface";

export const ConfigValueTransformers = {
    sso: function (sso: FastCommentsSSO) {
        if (!sso) {
            return 'Not defined';
        }
        if (sso.userDataJSONBase64 && sso.verificationHash && sso.timestamp) {
            let parsed = 'Could not decode! Not valid base64!';
            let parsedCorrectly = false;
            try {
                parsed = atob(sso.userDataJSONBase64);
                parsedCorrectly = true;
            } catch (e) {
                console.error('Could not decode value!', sso.userDataJSONBase64, e);
            }
            return {
                // TODO VERIFY TIMESTMAP is not too old
                displayText: 'Required Parameters Defined (correctness not verified) ️' + (parsedCorrectly ? '✔️' : '❌'),
                debug: {
                    parsed,
                    raw: JSON.stringify(sso)
                }
            };
        }
        if (sso.loginURL && sso.loginURL.trim()) {
            return {
                displayText: 'No user information, but login URL defined ️✔️',
                debug: JSON.stringify(sso)
            };
        }
        return {
            displayText: 'Invalid Configuration ❌',
            debug: JSON.stringify(sso)
        };
    }
}

export const ConfigValueTransformerByType = {
    'boolean': function(value) {
        return value ? 'Yes': 'No';
    },
    'number': function(value) {
        return value;
    },
    'string': function(value) {
        return value;
    },
    'object': function(value) {
        return JSON.stringify(value);
    },
    'null': function(value) {
        return value;
    },
    'undefined': function(value) {
        return value;
    }
}
