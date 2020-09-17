<template>
    <div class="container">
        <h1>{{ message }}</h1>
    </div>
</template>

<script lang="ts">
    const data = { message: 'no message yet' };
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'inspect' }, function (response) {
                data.message = JSON.stringify(response);
            });
        } else {
            console.log('The FastComments Debug Extension cannot communicate with the page as the current tab does not have an id', tabs[0]);
        }
    });

    export default {
        name: 'App',
        data() {
            return data
        },
    };
</script>

<style scoped lang="scss">
    .container {
        text-align: center;

        h1 {
            font-weight: 600;
        }
    }
</style>