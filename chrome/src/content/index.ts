import {Inspector} from '../../../common/inspector';

console.log('Hey, the content script is running!');

function codeToInject() {
// @ts-ignore
    const originalFastCommentsUI = window.FastCommentsUI;
// @ts-ignore
    window.FastCommentsUI = function (element, config) {
        console.log('PASSTHROUGH', element, config);
        return originalFastCommentsUI(element, config);
    }
}

function embed(fn: Function) {
    const script = document.createElement("script");
    script.text = `(${fn.toString()})();`;
    document.appendChild(script);
}

embed(codeToInject);

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        switch (message.action) {
            case 'inspect':
                sendResponse(Inspector.inspectDOM());
                break;
        }
    }
);
console.log('Content script loaded');
