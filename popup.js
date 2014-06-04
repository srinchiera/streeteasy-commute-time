$('#save').click(function() {
  /* Persist options and close window */

  saveOptions();
  window.close();
});

function loadOptions() {
  /* Sets popup based on users preferences, defaulting to config */

  chrome.storage.sync.get(["mode", "cache-server"],
    function(storageObj) {
      var mode = storageObj["mode"] || config["mode"];
      var cacheServer = storageObj["cache-server"] || config["cache-server"];

      $("#mode").val(mode);
      $('#cache-server').val(cacheServer);

  });
}

function saveOptions() {
  /* Saves user's preferences in chrome.storage */

  var mode        = $("#mode").val();
  var cacheServer = $("#cache-server").val();

  storageData = {
    'mode'         : mode,
    'cache-server' : cacheServer
  };

  chrome.storage.sync.set(storageData, function() {});
}

loadOptions();
