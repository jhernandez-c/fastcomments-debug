import {WidgetInstanceInterface} from '../../../common/widget-instance-interface';

let instances: WidgetInstanceInterface[] = [];

// This function gets inserted into the page, to get the widget instance information and send it to the content script.
function codeToInject() {
    function broadcast() {
        window.parent.postMessage(JSON.stringify({
            type: 'fc-instances',
            // @ts-ignore
            fcUIInstances: window.fcUIInstances
        }), '*');
    }

    setInterval(broadcast, 1000);
    broadcast();
}

// This embeds a script into the current page.
function embed(fn: Function) {
    const script = document.createElement("script");
    script.text = `(${fn.toString()})();`;
    document.documentElement.appendChild(script);
}

embed(codeToInject);

// Listen for any messages
window.addEventListener('message', (evt) => {
    try {
        const dataParsed = JSON.parse(evt.data);
        if (dataParsed.type === 'fc-instances') {
            instances = dataParsed.fcUIInstances;
        }
    } catch (e) {
    }
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
