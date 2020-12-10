browser.tabs.query({
    active: true,
    currentWindow: true,
  }).then(tabs => {
    let tabId = tabs[0].id;
    browser.messageDisplay.getDisplayedMessage(tabId).then((message) => {
      var spamDomain = extractDomain(message.author);
      var abuseEmail = getAbuseEmail(spamDomain);
      browser.messages.getRaw(message.id).then((raw) => 
        browser.compose.beginNew({  to: abuseEmail,
                                    subject: "Spam Abuse from: " + spamDomain,
                                    plainTextBody: getBody(spamDomain, raw)
            })
        );
    });
});

function getBody(spamDomain, rawSpam){
    return `To whom it may concern, \n
            I am writing to you today to report the following domain: ${spamDomain}. \n
            This domain is sending me unsolocited spam emails. \n
            Please take appropriate measures to avoid future abuse from this user. \n

            You will find the raw spam email below: \n
            ${rawSpam};
    `;
}
function extractDomain(author){
    return author.split("@")[1].split(">")[0];
}

function getAbuseEmail(spamDomain){
    return "abuse@namecheap.com";
}