import {Inspector} from '../../../common/inspector';

console.log('Hey, the content script is running!');
let instances = null;

function codeToInject() {
    setInterval(() => {
        console.log('???', window.fcUIInstances);
        window.parent.postMessage(JSON.stringify({
            type: 'redirect',
            fcUIInstances: window.fcUIInstances
        }), '*');
    }, 1000);
}

function embed(fn: Function) {
    const script = document.createElement("script");
    script.text = `(${fn.toString()})();`;
    document.documentElement.appendChild(script);
}

embed(codeToInject);

// Listen for any messages
window.addEventListener("message", (evt) => {
    // TODO validate request
    instances = evt.data;
})

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        switch (message.action) {
            case 'inspect':
                sendResponse(instances);
                break;
        }
    }
);
console.log('Content script loaded');
