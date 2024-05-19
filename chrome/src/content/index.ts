// This function gets inserted into the page, to get the widget instance information and send it to the content script.
function codeToInject() {
    function broadcastFCInstances() {
        /**
         * We are not using WeakSet here because then we'd have to do a typeof === 'object' check, and
         * this gets turned into invalid minified code with Parcel 1. We also can't disable minification in Parcel 1.
         * We tried to migrate to Parcel 2 in 2022 and had major issues, we should attempt this again in the future and disable
         * minification since it's not really needed for our tiny plugin.
         */
        const seen = new WeakSet();
        window.parent.postMessage(JSON.stringify({
            type: 'fc-instances',
            // @ts-ignore
            fcUIInstances: window.fcUIInstances
        }, function (key, value) {
            if (typeof value === 'object' && value) {
                // Something may create a circular reference somewhere, like with the React library. Don't let this break the debugger.
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        }), '*');
    }

    setInterval(broadcastFCInstances, 1000);
    broadcastFCInstances();

    let embedJsInterval: number;
    let hasEmbedJS: boolean | null = null; // Do we have any FastComments embed.js scripts on the page?
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
        if (dataParsed.action === 'analyze') {
            embed(codeToInject);
        }
    } catch (e) {
    }
});
