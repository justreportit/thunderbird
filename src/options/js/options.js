// Helper to check if a setting is managed by enterprise policy
async function isManaged(key) {
  try {
    const managed = await browser.storage.managed.get(key);
    return managed && managed[key] !== undefined;
  } catch (e) {
    return false;
  }
}

// Helper to disable and mark UI elements as managed
function markAsManaged(selector, labelText) {
  $(selector).prop('disabled', true).addClass('managed-setting');
  $(selector).closest('.form-check, .form-group').append(
    '<span class="managed-badge">Enterprise Managed</span>'
  );
}

// Locales setup
$("#tab1").html(browser.i18n.getMessage("general.tab.1"));
$("#tab2").html(browser.i18n.getMessage("general.tab.2"));
$("#tab3").html(browser.i18n.getMessage("general.tab.3"));
$("#tab4").html(browser.i18n.getMessage("general.tab.4"));
$("#tab5").html(browser.i18n.getMessage("general.tab.5"));
$("#tab6").html(browser.i18n.getMessage("general.tab.6"));

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
$("#menu1 #title4").html(browser.i18n.getMessage("options.menu1.title4"));
$("#menu1 #description4").html(browser.i18n.getMessage("options.menu1.description4") + "&emsp;&emsp;&emsp;");
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

$("#menu6 #title").html(browser.i18n.getMessage("options.menu6.title"));
$("#menu6 #description").html(browser.i18n.getMessage("options.menu6.description") + "&emsp;&emsp;&emsp;");
$("#menu6 #label1").html(browser.i18n.getMessage("options.menu6.label1"));
$("#menu6 #label2").html(browser.i18n.getMessage("options.menu6.label2"));
$("#menu6 #label3").html(browser.i18n.getMessage("options.menu6.label3"));$("#messageSource .i18n_source_locales").html(browser.i18n.getMessage("options.menu6.source.locales"));
$("#menu6 #locales").html(browser.i18n.getMessage("options.menu6.locales"));
$("#menu6 #english").html(browser.i18n.getMessage("options.menu6.english"));
$("#menu6 #custom").html(browser.i18n.getMessage("options.menu6.custom"));
$("#menu6 #submit").html(browser.i18n.getMessage("general.submit"));

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

$("#menu1 input[name=extension]").on("click", function(){
  $('#alertSuccess').show();
  var extension = $("#" + this.id)[0].id;
  browser.storage.local.set({"extension":extension});
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

$("#messageSource").on("change", function() {
  if ($(this).val() === "custom") {
    $("#customMessageFields").show();
  } else {
    $("#customMessageFields").hide();
  }
});

$("#menu6 #submit").on("click", function(){
  $('#alertSuccess6').show();
  let messageSource = $("#messageSource").val();
  browser.storage.local.set({"messageSource": messageSource});

  if (messageSource === "custom") {
    let customTitle = $("#customTitle").val().trim();
    let customBody = $("#customBody").val().trim();
    browser.storage.local.set({
      "customTitle": customTitle,
      "customBody": customBody
    });
  }
});

$(document).ready(async function(){
  $('#alertSuccess').hide();
  $('#alertSuccess2').hide();
  $('#alertSuccess3').hide();
  $('#alertSuccess4').hide();
  $('#alertSuccess5').hide();
  $('#alertSuccess6').hide();

  // Check for managed settings and disable UI
  if (await isManaged("mode")) {
    markAsManaged("#menu1 input[name=mode]", "Configuration Mode");
  }
  if (await isManaged("action")) {
    markAsManaged("#menu1 input[name=action]", "Default Action");
  }
  if (await isManaged("trim")) {
    markAsManaged("#menu1 input[name=trim]", "Trim file");
  }
  if (await isManaged("extension")) {
    markAsManaged("#menu1 input[name=extension]", "File Extension");
  }
  if (await isManaged("whois")) {
    markAsManaged("#menu2 input[name=whois]", "WHOIS URL");
  }
  if (await isManaged("server") || await isManaged("api-key")) {
    markAsManaged("#menu3 #serverURL, #menu3 #apiKey, #menu3 #submit, #menu3 #reset", "Lookup Server");
  }
  if (await isManaged("spamcop")) {
    markAsManaged("#menu4 #spamcopID, #menu4 #quick, #menu4 #submit", "SpamCop Configuration");
  }
  if (await isManaged("custom")) {
    markAsManaged("#menu5 #customEmail, #menu5 #submit", "Custom Report Address");
  }
  if (await isManaged("messageSource") || await isManaged("customTitle") || await isManaged("customBody")) {
    markAsManaged("#menu6 #messageSource, #menu6 #customTitle, #menu6 #customBody, #menu6 #submit", "Custom Message");
  }

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
  browser.storage.local.get("extension").then((item) => {
    if (item.extension == "eml"){
      $("#eml").prop("checked", true);
      $("#txt").prop("checked", false);
    }
    else {
      $("#eml").prop("checked", false);
      $("#txt").prop("checked", true);
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
  browser.storage.local.get("messageSource").then((item) => {
    $("#messageSource").val(item.messageSource || "locales");
    if (item.messageSource === "custom") {
      $("#customMessageFields").show();
    }
  });
  browser.storage.local.get(["customTitle", "customBody"]).then((item) => {
    $("#customTitle").val(item.customTitle || "");
    $("#customBody").val(item.customBody || "");
  });
});
