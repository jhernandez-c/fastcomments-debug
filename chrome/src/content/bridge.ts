import {WidgetInstanceInterface} from '../../../common/widget-instance-interface';

let watcherInjected = false;

let instances: WidgetInstanceInterface[] = [];
let hasEmbedJSGlobal: boolean | null = null;
let loaded = false;

window.addEventListener('message', (evt) => {
  try {
      const dataParsed = JSON.parse(evt.data);
      if (dataParsed.type === 'fc-instances') {
          instances = dataParsed.fcUIInstances;
          loaded = true;
      } else if (dataParsed.type === 'fc-embed-js') {
          hasEmbedJSGlobal = dataParsed.hasEmbedJS;
          loaded = true;
      }
  } catch (e) {
  }
});

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        switch (message.action) {
            case 'inspect':
                if (!watcherInjected) {
                    window.parent.postMessage(JSON.stringify({
                      action: 'analyze',
                    }), '*');
                    watcherInjected = true;
                    sendResponse(undefined);
                } else {
                    sendResponse({instances, hasEmbedJS: hasEmbedJSGlobal, loaded});
                }
                break;
        }
    }
);