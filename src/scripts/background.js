/* Initialize settings */
browser.storage.local.get("whois").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"whois":"https://whois.com/whois/"})}})
browser.storage.local.get("server").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"server":"https://api.justreport.it/lookup/"})}})
browser.storage.local.get("api-key").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"api-key":"DeVKFVPs3T40XYrUeQl9z5adMwopbYnY8jaAbecw"})}})
browser.storage.local.get("mode").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"mode":"registrar"})}})
browser.storage.local.get("spamcop").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"spamcop":""})}})
browser.storage.local.get("action").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"action":"leave"})}})
browser.storage.local.get("custom").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"custom":[]})}})
browser.storage.local.get("trim").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"trim":true})}})
browser.storage.local.get("extension").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"extension":"eml"})}})
browser.storage.local.get("messageSource").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"messageSource":"locales"})}})
browser.storage.local.get("customTitle").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"customTitle":""})}})
browser.storage.local.get("customBody").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"customBody":""})}})



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
                      composeEmailBasic(to, spamDomain, raw, message);
                    }
                    else
                      composeEmailBasic(to, spamDomain, raw, message).then(() => {
                        createPopup(spamDomain).then((popup) => popup());
                      });
                  })
                });
              }
              else {
                if (response.status == "success") {
                  to.push(response.data.email);
                  composeEmailBasic(to, spamDomain, raw, message);
                }
                else
                  composeEmailBasic(to, spamDomain, raw, message).then(() => {
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
                composeEmailBasic(to, spamDomain, raw, message).then(() => {
                  createPopup(spamDomain).then((popup) => popup());
                });
              })
            });
          }
          else if (configuration.mode == "custom")
            getCustomEmail().then((custom) => {
              composeEmailBasic(custom, spamDomain, raw, message);
            });
          else
            getSpamcopEmail().then((email) => {
              to.push(email);
              composeEmailBasic(to, spamDomain, raw, message);
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
          composeEmailSelected(custom, files, messages[0]);
        });
      else
        getSpamcopEmail().then((email) => {
          composeEmailSelected([email], files, messages[0]);
        });
    });
  } else {
    browser.messages.getRaw(messages[index].id).then((raw) => {
      getTrimmedFile(new Blob(convertRawToUint8Array(raw), { type: 'message/rfc822' })).then((file) => {
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
  let extensionSetting = await browser.storage.local.get("extension")

  let extension = extensionSetting.extension || 'eml';
  let fileName = `message.${extension}`;

  let blob = new Blob([tmpFile], { type: 'message/rfc822' });

  if (item.trim) {
    blob = blob.slice(0, 50 * 1024);
  }

  return new File([blob], fileName, { type: 'message/rfc822' });
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


async function getMessageContent() {
  let { messageSource } = await browser.storage.local.get("messageSource");

  if (messageSource === "locales") {
    return {
      subject: browser.i18n.getMessage("background.subject.basic"),
      body: browser.i18n.getMessage("background.body.basic")
    };
  } else if (messageSource === "english") {
    return {
      subject: "Spam Abuse from",
      body: "The attached message was marked as spam as it is sending unsolicited emails. Please take appropriate action.\n\n--"
    };
  } else if (messageSource === "custom") {
    let { customTitle, customBody } = await browser.storage.local.get(["customTitle", "customBody"]);
    return {
      subject: customTitle,
      body: customBody
    };
  }
}

// Update composeEmailBasic and composeEmailSelected to use getMessageContent
async function composeEmailBasic(to, domain, raw, message) {
  let file = await getTrimmedFile(new Blob(convertRawToUint8Array(raw), { type: 'message/rfc822' }));
  let identity = await getIdentity(message);
  let messageContent = await getMessageContent();

  let composeDetails = {
    to: to,
    subject: messageContent.subject + ": " + domain,
    plainTextBody: messageContent.body,
    attachments: [{ file: file }]
  };

  if (identity !== null) {
    composeDetails.identityId = identity.id;
  }

  await browser.compose.beginNew(composeDetails);
}

// Similar changes for composeEmailSelected

async function composeEmailSelected(to, files, message) {
  let identity = await getIdentity(message);
  let messageContent = await getMessageContent();

  let composeDetails = {
    to: to,
    subject: messageContent.subject + " [" + files.length + "]",
    plainTextBody: messageContent.body,
    attachments: files
  };

  if (identity !== null) {
    composeDetails.identityId = identity.id;
  }

  await browser.compose.beginNew(composeDetails);
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

async function getIdentity(message) {
  let accounts = await browser.accounts.list();
  let account = accounts.find(account => account.id === message.folder.accountId);
  if (!account || account.identities.length === 0) {
    return null;
  }
  return account.identities[0];
}