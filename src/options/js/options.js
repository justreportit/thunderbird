// Locales setup
$("#tab1").html(browser.i18n.getMessage("general.tab.1"));
$("#tab2").html(browser.i18n.getMessage("general.tab.2"));
$("#tab3").html(browser.i18n.getMessage("general.tab.3"));
$("#tab4").html(browser.i18n.getMessage("general.tab.4"));
$("#tab5").html(browser.i18n.getMessage("general.tab.5"));

$("#alertSuccess").html(browser.i18n.getMessage("general.message.success"));
$("#alertSuccess2").html(browser.i18n.getMessage("general.message.success"));
$("#alertSuccess3").html(browser.i18n.getMessage("general.message.success"));
$("#alertSuccess4").html(browser.i18n.getMessage("general.message.success"));
$("#alertSuccess5").html(browser.i18n.getMessage("general.message.success"));

$("#menu1 #title").html(browser.i18n.getMessage("options.menu1.title"));
$("#menu1 #description").html(browser.i18n.getMessage("options.menu1.description") + "&emsp;&emsp;&emsp;");
$("#menu1 #title2").html(browser.i18n.getMessage("options.menu1.title2"));
$("#menu1 #description2").html(browser.i18n.getMessage("options.menu1.description2") + "&emsp;&emsp;&emsp;");
$("#menu1 #title3").html(browser.i18n.getMessage("options.menu1.title3"));
$("#menu1 #description3").html(browser.i18n.getMessage("options.menu1.description3") + "&emsp;&emsp;&emsp;");
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
$("#menu4 #quickLabel").html(browser.i18n.getMessage("options.menu4.quick"));
$("#menu4 #submit").html(browser.i18n.getMessage("general.submit"));

$("#menu5 #title").html(browser.i18n.getMessage("options.menu5.title"));
$("#menu5 #description").html(browser.i18n.getMessage("options.menu5.description") + "&emsp;&emsp;&emsp;");
$("#menu5 #label1").html(browser.i18n.getMessage("options.menu5.label1"));
$("#menu5 #customEmail").html(browser.i18n.getMessage("options.menu5.customEmail"));
$("#menu5 #customEmailHelp").html(browser.i18n.getMessage("options.menu5.customEmailHelp"));
$("#menu5 #submit").html(browser.i18n.getMessage("general.submit"));

// Main Interface
$("li").on("click", function(){
  $('#alertSuccess').hide();
  $('#alertSuccess2').hide();
  $('#alertSuccess3').hide();
  $('#alertSuccess4').hide();
  $('#alertSuccess5').hide();
  $("li").removeClass("ui-state-active");
  $("#" + this.id).addClass("ui-state-active");
});

$("#menu1 input[name=mode]").on("click", function(){
  $('#alertSuccess').show();
  var mode = $("#" + this.id)[0].id;
  browser.storage.local.set({"mode":mode});
});

$("#menu1 input[name=action]").on("click", function(){
  $('#alertSuccess').show();
  var action = $("#" + this.id)[0].id;
  browser.storage.local.set({"action":action});
});

$("#menu1 input[name=trim]").on("click", function(){
  $('#alertSuccess').show();
  if ($("#trim").is(':checked'))
    browser.storage.local.set({"trim":true});
  else
    browser.storage.local.set({"trim":false});
});

$("#menu2 input").on("click", function(){
  $('#alertSuccess2').show();
  var whois = "";
  switch ($("#" + this.id)[0].id) {
    case "whois1":
      whois = "https://whois.com/whois/"
      break;
    case "whois2":
      whois = "https://who.is/whois/"
      break;
    case "whois3":
    default:
      break;
  }
  browser.storage.local.set({"whois":whois});
});

$("#menu3 #submit").on("click", function(){
  $('#alertSuccess3').show();
  browser.storage.local.set({"server":$("#serverURL").val().trim()})
  browser.storage.local.set({"api-key":$("#apiKey").val().trim()})
});

$("#menu3 #reset").on("click", function(){
  $('#alertSuccess3').show();
  $("#serverURL").val("");
  $("#apiKey").val("");
  browser.storage.local.set({"server":"https://api.justreport.it/lookup/"})
  browser.storage.local.set({"api-key":"DeVKFVPs3T40XYrUeQl9z5adMwopbYnY8jaAbecw"})
});

$("#menu4 #submit").on("click", function(){
  $('#alertSuccess4').show();
  var spamcop = "";
  if ($("#menu4 #quick").prop('checked'))
    spamcop = "quick." + $("#spamcopID").val().trim() + "@spam.spamcop.net"
  else
    spamcop = "submit." + $("#spamcopID").val().trim() + "@spam.spamcop.net"
  browser.storage.local.set({"spamcop":spamcop})
});

$("#menu5 #submit").on("click", function(){
  $('#alertSuccess5').show();
  var temp = $("#customEmail").val().trim()
  if (temp.split(",").length > 1){
    var custom = [];
    temp.split(",").forEach((element) => custom.push(element));
    browser.storage.local.set({"custom":custom})
  }
  else if (temp != "")
    browser.storage.local.set({"custom":[temp]})
  else
    browser.storage.local.set({"custom":[]})
});

$(document).ready(function(){
  $('#alertSuccess').hide();
  $('#alertSuccess2').hide();
  $('#alertSuccess3').hide();
  $('#alertSuccess4').hide();
  $('#alertSuccess5').hide();

  browser.storage.local.get("mode").then((item) => {
    if (item.mode == "registrar"){
      $("#registrar").prop("checked", true);
      $("#spamcop").prop("checked", false);
      $("#custom").prop("checked", false);
      $("#spamcop_and_custom").prop("checked", false);
      $("#all").prop("checked", false);
    }
    else if (item.mode == "spamcop"){
      $("#registrar").prop("checked", false);
      $("#spamcop").prop("checked", true);
      $("#custom").prop("checked", false);
      $("#spamcop_and_custom").prop("checked", false);
      $("#all").prop("checked", false);
    }
    else if (item.mode == "custom"){
      $("#registrar").prop("checked", false);
      $("#spamcop").prop("checked", false);
      $("#custom").prop("checked", true);
      $("#spamcop_and_custom").prop("checked", false);
      $("#all").prop("checked", false);
    }
    else if (item.mode == "spamcop_and_custom"){
      $("#registrar").prop("checked", false);
      $("#spamcop").prop("checked", false);
      $("#custom").prop("checked", false);
      $("#spamcop_and_custom").prop("checked", true);
      $("#all").prop("checked", false);
    }
    else {
      $("#registrar").prop("checked", false);
      $("#spamcop").prop("checked", false);
      $("#custom").prop("checked", false);
      $("#spamcop_and_custom").prop("checked", false);
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
      $("#whois3").prop("checked", false);
    }
    else if (item.whois == "https://who.is/whois/"){
      $("#whois1").prop("checked", false);
      $("#whois2").prop("checked", true);
      $("#whois3").prop("checked", false);
    }
    else {
      $("#whois1").prop("checked", false);
      $("#whois2").prop("checked", false);
      $("#whois3").prop("checked", true);
    }
  })
  browser.storage.local.get("trim").then((item) => {
    if (item.trim)
      $("#trim").prop('checked', true);
  });
  browser.storage.local.get("server").then((item) => {
    if (item.server != "https://api.justreport.it/lookup/")
      $("#serverURL").val(item.server);
  });
  browser.storage.local.get("api-key").then((item) => {
    if (item["api-key"] != "DeVKFVPs3T40XYrUeQl9z5adMwopbYnY8jaAbecw")
      $("#apiKey").val(item["api-key"]);
  });
  browser.storage.local.get("spamcop").then((item) => {
    if (item.spamcop.includes("quick"))
      $("#quick").prop("checked", true);
    if (item.spamcop !== "")
      $("#spamcopID").val(item.spamcop.split(".")[1].split("@")[0]);
  });
  browser.storage.local.get("custom").then((item) => {
    var custom = "";
    item.custom.forEach((element) => custom += element + ",");
    $("#customEmail").val(custom.slice(0, -1));
  });
});
