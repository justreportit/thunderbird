/* Initialize settings */
browser.storage.local.get("whois").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"whois":"https://whois.com/whois/"})}})
browser.storage.local.get("server").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"server":"https://api.justreport.it/lookup/"})}})
browser.storage.local.get("api-key").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"api-key":"DeVKFVPs3T40XYrUeQl9z5adMwopbYnY8jaAbecw"})}})
browser.storage.local.get("mode").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"mode":"registrar"})}})
browser.storage.local.get("spamcop").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"spamcop":""})}})
browser.storage.local.get("action").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"action":"leave"})}})
browser.storage.local.get("custom").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"custom":[]})}})
browser.storage.local.get("trim").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"trim":true})}})

browser.messageDisplayAction.onClicked.addListener((tab) =>{
  browser.messageDisplay.getDisplayedMessage(tab.id).then((message) => {
    browser.messages.getFull(message.id).then((parsed) => {
      browser.messages.getRaw(message.id).then((raw) => {
        browser.storage.local.get("mode").then((configuration) => {
          var sender = parsed.headers['return-path'][0] || message.author;
          var spamDomain = extractSpamDomain(sender);
          var to = [];
          if (configuration.mode == "registrar" || configuration.mode == "all"){
            getAbuseEmail(spamDomain).then((x) => x().then((y) => y().then((response) => {
              if (configuration.mode == "all"){
                getSpamcopEmail().then((email) => {
                  getCustomEmail().then((custom) => {
                    to.push.apply(to, custom);
                    to.push(email);
                    if (response.status == "success") {
                      to.push(response.data.email);
                      composeEmailBasic(to, spamDomain, raw);
                    }
                    else
                      composeEmailBasic(to, spamDomain, raw).then(() => {
                        createPopup(spamDomain).then((popup) => popup());
                      });
                  })
                });
              }
              else {
                if (response.status == "success") {
                  to.push(response.data.email);
                  composeEmailBasic(to, spamDomain, raw);
                }
                else
                  composeEmailBasic(to, spamDomain, raw).then(() => {
                    createPopup(spamDomain).then((popup) => popup());
                  });
              }
            })));
          }
          else if (configuration.mode == "spamcop_and_custom") {
            getSpamcopEmail().then((email) => {
              getCustomEmail().then((custom) => {
                to.push.apply(to, custom);
                to.push(email);
                composeEmailBasic(to, spamDomain, raw).then(() => {
                  createPopup(spamDomain).then((popup) => popup());
                });
              })
            });
          }
          else if (configuration.mode == "custom")
            getCustomEmail().then((custom) => {
              composeEmailBasic(custom, spamDomain, raw);
            });
          else
            getSpamcopEmail().then((email) => {
              to.push(email);
              composeEmailBasic(to, spamDomain, raw);
            });
          performAction(message.id);
        });
      });
    });
  });
});

browser.menus.create({
  "title": "Report It",
  "visible": true
});

browser.menus.onClicked.addListener((info, tab) => {
  if ('selectedMessages' in info){
    processSelectedMessage([], info.selectedMessages.messages, 0);
  }
});

function processSelectedMessage(files, messages, index){
  if (index == messages.length) {
    browser.storage.local.get("mode").then((configuration) => {
      if (configuration.mode == "custom")
        getCustomEmail().then((custom) => {
          composeEmailSelected(custom, files);
        });
      else
        getSpamcopEmail().then((email) => {
          composeEmailSelected([email], files);
        });
    });
  } else {
    browser.messages.getRaw(messages[index].id).then((raw) => {
      getTrimmedFile(new File(convertRawToUint8Array(raw), "message" + (index + 1) + ".eml", { type: 'message/rfc822' })).then((file) => {
        files.push({file: file});
        performAction(messages[index].id);
        processSelectedMessage(files, messages, index+1);
      })
    });
  }
}

function convertRawToUint8Array(raw) {
  // Reason: https://thunderbird.topicbox.com/groups/addons/T06356567165277ee-M25e96f2d58e961d6167ad348
  let bytes = new Array(raw.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = raw.charCodeAt(i) & 0xFF;
  }
  return [new Uint8Array(bytes)];
}

async function getTrimmedFile(tmpFile) {
  let item = await browser.storage.local.get("trim")
  if (item.trim) {
    // Create a new Blob from the File
    let blob = new Blob([tmpFile]);

    // Slice the Blob to 50KB
    let slicedBlob = blob.slice(0, 50 * 1024);

    // Create a new File from the sliced Blob
    tmpFile = new File([slicedBlob], tmpFile.name);
  }
  return tmpFile;
}

async function performAction(messageId){
  browser.storage.local.get("action").then((item) => {
    // Mark all messages as junk
    browser.messages.update(messageId, {
      "junk": true
    });
    if (item.action == "move"){
      browser.messages.delete([messageId], false);
    }
    else if (item.action == "delete") {
      browser.messages.delete([messageId], true);
    }
  });
}

function getSpamcopEmail(){
  return browser.storage.local.get("spamcop").then((item) => {
      return item.spamcop;
  });
}

function getCustomEmail(){
  return browser.storage.local.get("custom").then((item) => {
      return item.custom;
  });
}

async function composeEmailBasic(to, domain, raw){
  let file = await getTrimmedFile(new File(convertRawToUint8Array(raw), "message.eml", { type: 'message/rfc822' }));
  await browser.compose.beginNew({
    to: to,
    subject: browser.i18n.getMessage("background.subject.basic") + domain,
    plainTextBody: browser.i18n.getMessage("background.body.basic"),
    attachments: [{file:file}]
  });
}

async function composeEmailSelected(to, files){
  await browser.compose.beginNew({
    to: to,
    subject: browser.i18n.getMessage("background.subject.selected") + " [" + files.length + "]",
    plainTextBody: browser.i18n.getMessage("background.body.selected"),
    attachments: files
  });
}

function createPopup(domain){
  return browser.storage.local.get("whois").then((item) => async function(){
    if (item.whois != "") {
      var window = await messenger.windows.create({
        url: item.whois + domain,
        type: "popup"
      });
      await setFocused(window);
    }
  });
}

async function setFocused(window){
  await messenger.windows.update(window.id, {
    focused: true
  });
}

function extractSpamDomain(author){
  if (author.includes("<"))
    return author.split("<")[1].split(">")[0].split("@")[1];
  else
    return author.split("@")[1];
}

function getAbuseEmail(domain){
  return browser.storage.local.get("server").then((server) => async function(){
    return await browser.storage.local.get("api-key").then((key) => async function(){
      var url = server["server"] + domain;
      var headers = {
        "Content-Type": "application/json",
        "x-api-key": key["api-key"]
      }
      var fetchInfo = {
          mode: "cors",
          method: "GET",
          headers: headers
      };
      var response = await fetch(url, fetchInfo);
      return await response.json();
      })
  });
}
