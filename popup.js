$('#save').click(function() {
  /* Persist options and close window */

  saveOptions();
  window.close();
});

/* Disable input box when not using cache */
$("#use-cache").click(function() {
    $("#cache-server").attr("disabled", !this.checked);
});

function loadOptions() {
  /* Sets popup based on users preferences, defaulting to config */

  chrome.storage.sync.get(["mode", "destination", "use-cache", "cache-server"],
    function(storageObj) {
      var mode = storageObj["mode"] || config["mode"];
      var destination = storageObj["destination"] || config["destination"];
      var useCache = storageObj["use-cache"] || false;
      var cacheServer = storageObj["cache-server"] || config["cache-server"];

      $("#mode").val(mode);
      $('#destination').val(destination);
      $('#cache-server').val(cacheServer);

      if (useCache) {
        $('#use-cache').prop('checked', true);
        $("#cache-server").attr("disabled", false);
      }
  });
}

function saveOptions() {
  /* Saves user's preferences in chrome.storage */

  var mode        = $("#mode").val();
  var destination = $("#destination").val();
  var useCache    = $("#use-cache").prop("checked");
  var cacheServer = $("#cache-server").val();

  storageData = {
    'mode'         : mode,
    'destination'  : destination,
    'use-cache'    : useCache,
    'cache-server' : cacheServer
  };

  chrome.storage.sync.set(storageData, function() {});
}

loadOptions();
