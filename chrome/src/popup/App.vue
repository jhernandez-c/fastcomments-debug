<template>
    <div class="container">
        <div class="logo-container">
            <img src="/../../assets/icons/favicon.png" class="logo" alt="FastComments Logo" title="FastComments"/>
            <span>FastComments Debugger</span>
        </div>

        <h2 v-if="!loaded" class="loading">...Loading...</h2>
        <div v-else>
            <h2 v-if="instances.length === 0">No instances found! Check the Chrome Inspector for errors.</h2>
            <div v-else>
                <h4>{{ Number(instances.length).toLocaleString() }} {{ instances.length === 1 ? 'instance' : 'instances'
                    }} of the comment widget found.</h4>

                <div class="widget-instance" v-for="(instance, index) in instances">
                    <h4>Instance {{ index + 1 }} ({{ instance.config.urlId }})</h4>

                    <h3 class="red" v-if="!instance.requested">No request to FastComment's servers! Check the Chrome
                        Inspector for errors.</h3>
                    <h3 class="red" v-if="instance.config.readonly">Instance is readonly! The widget will not render
                        anything if there are no comments for this page.</h3>
                    <h3 class="red" v-if="instance.config.allowAnon">Do not pass allowAnon to the widget configuration
                        manually! Add a customization rule instead. Otherwise, the UI
                        will allow no email to be entered but comments will not save.</h3>

                    <div class="meta">
                        <h3>Instance Settings (Passed to Widget)</h3>
                        <ul>
                            <li class="meta-item" v-for="(value, key) in instance.configViewModel"><b>{{key}}</b>:
                                {{value}}
                            </li>
                        </ul>
                        <h3>Instance Settings (Final)</h3>
                        <h4 class="red"
                            v-if="instance.configViewModelFinal === null || Object.keys(instance.configViewModelFinal).length === 0">
                            No final configuration found! If widget is loading, open/close this popup to get the latest
                            values.</h4>
                        <ul v-else>
                            <li class="meta-item" v-for="(value, key) in instance.configViewModelFinal"><b>{{key}}</b>:
                                {{value}}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <h3 class="red" v-if="hasEmbedJS === false">The FastComments embed script (embed.min.js) was not found on
                this page.</h3>
        </div>
    </div>
    <div class="left-right-art"></div>
</template>

<script lang="ts">
    import {WidgetInstanceInterface} from "../../../common/widget-instance-interface";
    import configToViewModel from "../../../common/config-to-view-model";

    interface ViewModel {
        instances: WidgetInstanceInterface[]
        hasEmbedJS: boolean | null
        loaded: boolean
    }

    const data: ViewModel = {
        instances: [],
        hasEmbedJS: null,
        loaded: false
    };

    interface ContentResponse {
        instances: WidgetInstanceInterface[]
        hasEmbedJS: boolean | null
        loaded: boolean
    }

    function queryContentScript() {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            if (tabs[0].id) {
                try {
                    chrome.tabs.sendMessage(tabs[0].id, {action: 'inspect'}, function (response: ContentResponse) {
                        if (!response) {
                            return;
                        }
                        data.instances = response.instances || [];
                        for (const instance of data.instances) {
                            for (const key in instance.config) {
                                // @ts-ignore
                                if (instance.config[key] === 'true') {
                                    // @ts-ignore
                                    instance.config[key] = true;
                                    // @ts-ignore
                                } else if (instance.config[key] === 'false') { // not sure why this happens atm, but hack fixes it
                                    // @ts-ignore
                                    instance.config[key] = false;
                                    // @ts-ignore
                                } else if (typeof instance.config[key] === 'string') {
                                    // @ts-ignore
                                    instance.config[key] = decodeURIComponent(instance.config[key]);
                                }
                            }
                            instance.configViewModel = configToViewModel(instance.config);
                            instance.configViewModelFinal = configToViewModel(instance.finalConfig);
                        }
                        data.hasEmbedJS = response.hasEmbedJS;
                        data.loaded = response.loaded;
                    });
                } catch (e) {
                    console.debug(e);
                }
            } else {
                console.log('The FastComments Debug Extension cannot communicate with the page as the current tab does not have an id', tabs[0]);
            }
        });
    }

    setInterval(queryContentScript, 1000);
    queryContentScript();

    export default {
        name: 'App',
        data() {
            return data
        },
    };
</script>

<style scoped lang="scss">
    .container {
        width: 500px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

        .logo-container {
            font-size: 20px;

            > * {
                display: inline-block;
                vertical-align: middle;
            }

            .logo {
                width: 30px;
                margin: 5px;
            }
        }

        .loading {
            text-align: center;
        }

        .widget-instance {
            margin: 5px;
            padding: 5px;
            border: 1px solid #000;

            .meta {
                .meta-item {
                    padding: 3px;
                    word-break: break-all;
                }
            }
        }
    }

    .left-right-art {
        position: fixed;
        bottom: -150px;
        right: -150px;
        height: 300px;
        width: 300px;
        background: #000;
        transform: rotate(45deg);
        z-index: -1;
    }

    .red {
        color: red;
    }
</style>