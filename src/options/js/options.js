// Locales setup
$("#tab1").html(browser.i18n.getMessage("general.tab.1"));
$("#tab2").html(browser.i18n.getMessage("general.tab.2"));
$("#tab3").html(browser.i18n.getMessage("general.tab.3"));
$("#tab4").html(browser.i18n.getMessage("general.tab.4"));
$("#tab5").html(browser.i18n.getMessage("general.tab.5"));

$("#menu1 #title").html(browser.i18n.getMessage("options.menu1.title"));
$("#menu1 #description").html(browser.i18n.getMessage("options.menu1.description") + "&emsp;&emsp;&emsp;");
$("#menu1 #title2").html(browser.i18n.getMessage("options.menu1.title2"));
$("#menu1 #description2").html(browser.i18n.getMessage("options.menu1.description2") + "&emsp;&emsp;&emsp;");
$("#menu1 #leave").html(browser.i18n.getMessage("options.menu1.leave"));
$("#menu1 #delete").html(browser.i18n.getMessage("options.menu1.delete"));
$("#menu1 #move").html(browser.i18n.getMessage("options.menu1.move"));

$("#menu2 #title").html(browser.i18n.getMessage("options.menu2.title"));
$("#menu2 #description").html(browser.i18n.getMessage("options.menu2.description") + "&emsp;&emsp;&emsp;");

$("#menu3 #title").html(browser.i18n.getMessage("options.menu3.title"));
$("#menu3 #description").html(browser.i18n.getMessage("options.menu3.description") + "&emsp;&emsp;&emsp;");
$("#menu3 #label1").html(browser.i18n.getMessage("options.menu3.label1"));
$("#menu3 #serverURL").attr("placeholder", browser.i18n.getMessage("options.menu3.serverURL"));
$("#menu3 #serverURLHelp").html(browser.i18n.getMessage("options.menu3.serverURLHelp"));
$("#menu3 #label2").html(browser.i18n.getMessage("options.menu3.label2"));
$("#menu3 #apiKey").attr("placeholder", browser.i18n.getMessage("options.menu3.apiKey"));
$("#menu3 #apiKeyHelp").html(browser.i18n.getMessage("options.menu3.apiKeyHelp"));
$("#menu3 #submit").html(browser.i18n.getMessage("general.submit"));
$("#menu3 #reset").html(browser.i18n.getMessage("general.reset"));

$("#menu4 #title").html(browser.i18n.getMessage("options.menu4.title"));
$("#menu4 #description").html(browser.i18n.getMessage("options.menu4.description") + "&emsp;&emsp;&emsp;");
$("#menu4 #label1").html(browser.i18n.getMessage("options.menu4.label1"));
$("#menu4 #spamcop").html(browser.i18n.getMessage("options.menu4.spamcop"));
$("#menu4 #spamcopHelp").html(browser.i18n.getMessage("options.menu4.spamcopHelp"));
$("#menu4 #submit").html(browser.i18n.getMessage("general.submit"));

$("#menu5 #title").html(browser.i18n.getMessage("options.menu5.title"));
$("#menu5 #description").html(browser.i18n.getMessage("options.menu5.description") + "&emsp;&emsp;&emsp;");
$("#menu5 #label1").html(browser.i18n.getMessage("options.menu5.label1"));
$("#menu5 #customEmail").html(browser.i18n.getMessage("options.menu5.customEmail"));
$("#menu5 #customEmailHelp").html(browser.i18n.getMessage("options.menu5.customEmailHelp"));
$("#menu5 #submit").html(browser.i18n.getMessage("general.submit"));

// Main Interface
$("li").on("click", function(){
  $("li").removeClass("ui-state-active");
  $("#" + this.id).addClass("ui-state-active");
});

$("#menu1 input[name=mode]").on("click", function(){
  var mode = $("#" + this.id)[0].id;
  browser.storage.local.set({"mode":mode});
});

$("#menu1 input[name=action]").on("click", function(){
  var action = $("#" + this.id)[0].id;
  browser.storage.local.set({"action":action});
});

$("#menu2 input").on("click", function(){
  var whois = ($("#" + this.id)[0].id == "whois1")? "https://whois.com/whois/" : "https://who.is/whois/";
  browser.storage.local.set({"whois":whois});
});

$("#menu3 #submit").on("click", function(){
  browser.storage.local.set({"server":$("#serverURL").val()})
  browser.storage.local.set({"api-key":$("#serverURL").val()})
});

$("#menu3 #reset").on("click", function(){
  $("#serverURL").val("");
  $("#apiKey").val("");
  browser.storage.local.set({"server":"https://api.justreport.it/lookup/"})
  browser.storage.local.set({"api-key":"API-KEY"})
});

$("#menu4 #submit").on("click", function(){
  browser.storage.local.set({"spamcop":$("#spamcopID").val()})
});

$("#menu5 #submit").on("click", function(){
  var temp = $("#customEmail").val()
  if (temp.split(",").length > 1){
    var custom = [];
    temp.split(",").forEach((element) => custom.push(element));
    browser.storage.local.set({"custom":custom})
  }
  else
    browser.storage.local.set({"custom":[temp]})
});

$(document).ready(function(){
  browser.storage.local.get("mode").then((item) => {
    if (item.mode == "registrar"){
      $("#registrar").prop("checked", true);
      $("#spamcop").prop("checked", false);
      $("#custom").prop("checked", false);
      $("#all").prop("checked", false);
    }
    else if (item.mode == "spamcop"){
      $("#registrar").prop("checked", false);
      $("#spamcop").prop("checked", true);
      $("#custom").prop("checked", false);
      $("#all").prop("checked", false);
    }
    else if (item.mode == "custom"){
      $("#registrar").prop("checked", false);
      $("#spamcop").prop("checked", false);
      $("#custom").prop("checked", true);
      $("#all").prop("checked", false);
    }
    else {
      $("#registrar").prop("checked", false);
      $("#spamcop").prop("checked", false);
      $("#custom").prop("checked", false);
      $("#all").prop("checked", true);
    }
  });
  browser.storage.local.get("action").then((item) => {
    if (item.action == "leave"){
      $("#leave").prop("checked", true);
      $("#delete").prop("checked", false);
      $("#move").prop("checked", false);
    }
    else if (item.action == "delete"){
      $("#leave").prop("checked", false);
      $("#delete").prop("checked", true);
      $("#move").prop("checked", false);
    }
    else {
      $("#leave").prop("checked", false);
      $("#delete").prop("checked", false);
      $("#move").prop("checked", true);
    }
  });
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
  browser.storage.local.get("spamcop").then((item) => {
    $("#spamcopID").val(item.spamcop);
  });
  browser.storage.local.get("custom").then((item) => {
    var custom = "";
    item.custom.forEach((element) => custom += element + ",");
    $("#customEmail").val(custom.slice(0, -1));
  });
});
