import {WidgetInstanceInterface} from '../../../common/widget-instance-interface';

let instances: WidgetInstanceInterface[] = [];
let hasEmbedJSGlobal: boolean|null = null;

// This function gets inserted into the page, to get the widget instance information and send it to the content script.
function codeToInject() {
    function broadcastFCInstances() {
        window.parent.postMessage(JSON.stringify({
            type: 'fc-instances',
            // @ts-ignore
            fcUIInstances: window.fcUIInstances
        }), '*');
    }

    setInterval(broadcastFCInstances, 1000);
    broadcastFCInstances();

    let hasEmbedJS : boolean|null = null; // Do we have any FastComments embed.js scripts on the page?
    function broadcastFCEmbedJS() {
        let newEmbedJS = false;
        for (let i = 0; i < document.scripts.length; i++) { // for... of gets turned into a broken loop for some reason
            const script = document.scripts[i];
            if (script.src.includes('fastcomments') && script.src.includes('embed')) {
                newEmbedJS = true;
                break;
            }
        }
        if (hasEmbedJS === newEmbedJS) {
            return;
        }
        hasEmbedJS = newEmbedJS;
        window.parent.postMessage(JSON.stringify({
            type: 'fc-embed-js',
            // @ts-ignore
            hasEmbedJS
        }), '*');
    }

    setInterval(broadcastFCEmbedJS, 5000);
    broadcastFCEmbedJS();
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
        } else if(dataParsed.type === 'fc-embed-js') {
            hasEmbedJSGlobal = dataParsed.hasEmbedJS;
        }
    } catch (e) {
    }
})

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        switch (message.action) {
            case 'inspect':
                sendResponse({ instances, hasEmbedJS: hasEmbedJSGlobal });
                break;
        }
    }
);
