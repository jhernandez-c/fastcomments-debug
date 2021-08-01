import {FastCommentsSSO} from "./fastcomments-config-interface";

export const ConfigValueTransformers = {
    sso: function (sso: FastCommentsSSO) {
        if (!sso) {
            return 'Not defined';
        }
        if (sso.userDataJSONBase64 && sso.verificationHash && sso.timestamp) {
            return {
                // TODO include decoded userDataJSONBase64
                // TODO VERIFY TIMESTMAP is not too old
                displayText: 'Required Parameters Defined (correctness not verified) ✔️',
                debug: JSON.stringify(sso)
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
