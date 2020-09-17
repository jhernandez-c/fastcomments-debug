import {FastCommentsSSO} from "./fastcomments-config-interface";

export const ConfigValueTransformers = {
    sso: function (sso: FastCommentsSSO) {
        if (!sso) {
            return 'Not defined';
        }
        if (sso.userDataJSONBase64 && sso.verificationHash && sso.timestamp) {
            return 'Required Parameters Defined (correctness not verified) ✔️';
        }
        if (sso.loginURL && sso.loginURL.trim()) {
            return 'No user information, but login URL defined ️✔️';
        }
        return 'Invalid Configuration ❌';
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
