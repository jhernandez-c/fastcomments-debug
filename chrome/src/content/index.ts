import {WidgetInstanceInterface} from '../../../common/widget-instance-interface';

let instances: WidgetInstanceInterface[] = [];
let hasEmbedJSGlobal: boolean|null = null;
let loaded = false;

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

    let embedJsInterval: number;
    let hasEmbedJS : boolean|null = null; // Do we have any FastComments embed.js scripts on the page?
    function broadcastFCEmbedJS() {
        if (hasEmbedJS) {
            if (embedJsInterval) {
                clearInterval(embedJsInterval);
            }
            return;
        }
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

    embedJsInterval = setInterval(broadcastFCEmbedJS, 1000);
    broadcastFCEmbedJS();
}

// This embeds a script into the current page.
function embed(fn: Function) {
    const script = document.createElement("script");
    script.text = `(${fn.toString()})();`;
    document.documentElement.appendChild(script);
}

// Listen for any messages from the page
window.addEventListener('message', (evt) => {
    try {
        const dataParsed = JSON.parse(evt.data);
        if (dataParsed.type === 'fc-instances') {
            instances = dataParsed.fcUIInstances;
            loaded = true;
        } else if(dataParsed.type === 'fc-embed-js') {
            hasEmbedJSGlobal = dataParsed.hasEmbedJS;
            loaded = true;
        }
    } catch (e) {
    }
});

let watcherInjected = false;

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        switch (message.action) {
            case 'inspect':
                if (!watcherInjected) {
                    embed(codeToInject);
                    watcherInjected = true;
                    sendResponse(undefined);
                } else {
                    sendResponse({ instances, hasEmbedJS: hasEmbedJSGlobal, loaded });
                }
                break;
        }
    }
);
