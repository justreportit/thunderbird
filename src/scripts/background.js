/* Initialize settings */
browser.storage.local.get("whois").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"whois":"https://whois.com/whois/"})}})
browser.storage.local.get("server").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"server":"https://api.justreport.it/lookup/"})}})
browser.storage.local.get("api-key").then((item) => {if (Object.entries(item).length==0){browser.storage.local.set({"api-key":"API-KEY"})}})

browser.messageDisplayAction.onClicked.addListener((tab) =>{
  browser.messageDisplay.getDisplayedMessage(tab.id).then((message) => {
    browser.messages.getRaw(message.id).then((raw) => {
      var fromHeader = extractFromHeader(message.author);
      var receivedFromHeader = extractReceivedFromHeader(raw);
      var spamDomain = extractSpamDomain(fromHeader, receivedFromHeader);
      getAbuseEmail(spamDomain).then((response) => {
        response().then((serverResponse) => {
          if (serverResponse.status == "success"){
            composeEmail(serverResponse.data.email, spamDomain, raw)
          }
          else {
            composeEmail("", spamDomain, raw).then(() => {
              createPopup(spamDomain).then((popup) => popup());
            });
          }
        })
      })
    });
  });
})

async function composeEmail(to, domain, raw){
  await browser.compose.beginNew({to: to,
    subject: "Spam Abuse from: " + domain,
    plainTextBody: getBody(domain, raw)
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

function getBody(spamDomain, rawSpam){
  return `To whom it may concern, \n
          I am writing to you today to report the following domain: ${spamDomain}. \n
          This domain is sending me unsolicited spam emails. \n
          Please take appropriate measures to avoid future abuse from this user. \n
          You will find the raw spam email below: \n
          ${rawSpam}`;
}

function extractSpamDomain(fromHeader, receivedFromHeader){
  if (validateDomain(receivedFromHeader) && !receivedFromHeader.includes("local"))
    return receivedFromHeader;
  else
    return fromHeader;
}

function validateDomain(domain){
  return /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/.test(domain)
}

function extractFromHeader(author){
  return author.split("<")[1].split(">")[0].split("@")[1];
}

function extractReceivedFromHeader(raw){
  var obj = {};
  raw.split('\n').forEach(v=>v.replace(/\s*(.*)\s*:\s*(.*)\s*/, (s,key,val)=>{
      obj[key]=isNaN(val)||val.length<1?val||undefined:Number(val);
  }));
  var tmp = obj["Received"].split(" ")[1].split(" ")[0];
  console.log(tmp.split(".")[-1])
  if (tmp.split(".").length > 1){
    return tmp.split(".").reverse()[1] + "." + tmp.split(".").reverse()[0];
  }
  else
    return tmp;
}

function getAbuseEmail(domain){
  return browser.storage.local.get("server").then((item) => async function(){
    var url = item.server + domain;
    var headers = {
      "Content-Type": "application/json",
      "x-api-key": "API-KEY"
    }
    var fetchInfo = {
        mode: "cors",
        method: "GET",
        headers: headers
    };
    var response = await fetch(url, fetchInfo);
    return await response.json();
  });
}