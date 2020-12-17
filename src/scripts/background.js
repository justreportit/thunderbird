browser.messageDisplayAction.onClicked.addListener((tab) =>{
  browser.messageDisplay.getDisplayedMessage(tab.id).then((message) => {
    var spamDomain = extractDomain(message.author);
    getAbuseEmail(spamDomain).then((response) => {
      if (response.status == "success"){
        var abuseEmail = response.data.email;
        browser.messages.getRaw(message.id).then((raw) => 
        browser.compose.beginNew({to: abuseEmail,
                                  subject: "Spam Abuse from: " + spamDomain,
                                  plainTextBody: getBody(spamDomain, raw)
            })
        );
        }
      else {
        browser.messageDisplayAction.setPopup({'popup':'error.html'});
      }
    }).catch((error) => {
      browser.messageDisplayAction.setPopup({'popup':'error.html'});
    })
  });
})

function getBody(spamDomain, rawSpam){
  return `To whom it may concern, \n
          I am writing to you today to report the following domain: ${spamDomain}. \n
          This domain is sending me unsolocited spam emails. \n
          Please take appropriate measures to avoid future abuse from this user. \n
          You will find the raw spam email below: \n
          ${rawSpam}`;
}
function extractDomain(author){
  return author.split("@")[1].split(">")[0];
}

async function getAbuseEmail(domain)
{
    var url = "https://api.justreport.it/lookup/" + domain;
    var headers = {
      "Content-Type": "application/json",
      "x-api-key": "API_KEY"
    }
    var fetchInfo = {
        mode: "cors",
        method: "GET",
        headers: headers
    };
    var response = await fetch(url, fetchInfo);
    return await response.json();
}
