$('#save').click(function() {
  /* Persist options and close window */

  saveOptions();
});

function getServerName(cacheServer) {
  $.ajax({
    url: cacheServer + '/info',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Error retrieving data from cache server!");
      $('#server-name').text('Error retrieving data from cache server');
    },
    success: function(data, textStatus, jgXHR) {
      if (data['status'] == 'success') {
        $('#server-name').text(data['info']);
      } else {
        $('#server-name').text('Error retrieving server name');
      }
    }
  });
}

function loadOptions() {
  /* Sets popup based on users preferences, defaulting to config */

  chrome.storage.sync.get(["mode", "cache-server"],
    function(storageObj) {
      var mode = storageObj["mode"] || config["mode"];
      var cacheServer = storageObj["cache-server"] || config["cache-server"];

      $("#mode").val(mode);
      $('#cache-server').val(cacheServer);

      getServerName(cacheServer);
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

  chrome.storage.sync.set(storageData, function() { getServerName(cacheServer) });
}

loadOptions();
