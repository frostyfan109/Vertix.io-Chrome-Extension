console.log("loaded");
chrome.webRequest.onBeforeRequest.addListener(
       function(details) { console.log(details);return {redirectUrl: chrome.extension.getURL(details.url.split("/").slice(-1)[0])}; },
       {urls: ["*://*.vertix.io/js/app.js"]},
       ["blocking"]);
