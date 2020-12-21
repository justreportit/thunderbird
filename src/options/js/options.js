$("li").on("click", function(){
  $("li").removeClass("ui-state-active");
  $("#" + this.id).addClass("ui-state-active");
});

$("input").on("click", function(){
  var whois = ($("#" + this.id)[0].id == "whois1")? "https://whois.com/whois/" : "https://who.is/whois/";
  browser.storage.local.set({"whois":whois});
});

$("#submit").on("click", function(){
  browser.storage.local.set({"server":$("#serverURL").val()})
  browser.storage.local.set({"api-key":$("#serverURL").val()})
});

$("#reset").on("click", function(){
  $("#serverURL").val("");
  $("#apiKey").val("");
  browser.storage.local.set({"server":"https://api.justreport.it/lookup/"})
  browser.storage.local.set({"api-key":"API-KEY"})
});

$(document).ready(function(){
  browser.storage.local.get("whois").then((item) => {
    if (item.whois == "https://whois.com/whois/") {
      $("#whois1").prop("checked", true);
      $("#whois2").prop("checked", false);
    }
    else {
      $("#whois2").prop("checked", true);
      $("#whois1").prop("checked", false);
    }
  })
  browser.storage.local.get("server").then((item) => {
    if (item.server != "https://api.justreport.it/lookup/")
      $("#serverURL").val(item.server);
  });
  browser.storage.local.get("api-key").then((item) => {
    if (item["api-key"] != "API-KEY")
      $("#apiKey").val(item["api-key"]);
  });
});

