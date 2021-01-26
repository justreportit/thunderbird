/* Initialize settings */
browser.storage.local.get("whois").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"whois":"https://whois.com/whois/"})}})
browser.storage.local.get("server").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"server":"https://api.justreport.it/lookup/"})}})
browser.storage.local.get("api-key").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"api-key":"API-KEY"})}})
browser.storage.local.get("mode").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"mode":"registrar"})}})
browser.storage.local.get("spamcop").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"spamcop":""})}})
browser.storage.local.get("action").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"action":"leave"})}})
browser.storage.local.get("custom").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"custom":[]})}})

browser.messageDisplayAction.onClicked.addListener((tab) =>{
  browser.messageDisplay.getDisplayedMessage(tab.id).then((message) => {
    browser.messages.getRaw(message.id).then((raw) => {
      browser.storage.local.get("mode").then((configuration) => {
        var spamDomain = extractSpamDomain(message.author);
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
                    composeEmail(to, spamDomain, raw);
                  }
                  else
                    composeEmail(to, spamDomain, raw).then(() => {
                      createPopup(spamDomain).then((popup) => popup());
                    });
                })
              });
            }
            else {
              if (response.status == "success") {
                to.push(response.data.email);
                composeEmail(to, spamDomain, raw);
              }
              else
                composeEmail(to, spamDomain, raw).then(() => {
                  createPopup(spamDomain).then((popup) => popup());
                });
            }
          })));
        }
        else if (configuration.mode == "custom")
          getCustomEmail().then((custom) => {
            to.concat(custom);
            composeEmail(to, spamDomain, raw);
          });
        else
          getSpamcopEmail().then((email) => {
            to.push(email);
            composeEmail(to, spamDomain, raw);
          });
        performAction(message.id);
      });
    });
  });
});

async function performAction(messageId){
  browser.storage.local.get("action").then((item) => {
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
      return "submit." + item.spamcop + "@spam.spamcop.net";
  });
}

function getCustomEmail(){
  return browser.storage.local.get("custom").then((item) => {
      return item.custom;
  });
}

async function composeEmail(to, domain, raw){
  let file = new File([raw], "message.eml");
  await browser.compose.beginNew({
    to: to,
    subject: browser.i18n.getMessage("background.subject") + domain,
    plainTextBody: getBody(domain),
    attachments: [{file:file}]
  });
}

function createPopup(domain){
  return browser.storage.local.get("whois").then((item) => async function(){
    var window = await messenger.windows.create({
      url: item.whois + domain,
      type: "popup"
    });
    await setFocused(window);
  });
}

async function setFocused(window){
  await messenger.windows.update(window.id, {
    focused: true
  });
}

function getBody(spamDomain){
  return browser.i18n.getMessage("background.body");
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
