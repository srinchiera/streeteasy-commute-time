function display_times() {
  /* Displays travel time next to all listings */

  var address_elm_list = $('.details h5');
  var neighborhood_elm_list = $('.details_info a');

  for (var i = 0; i < address_elm_list.length; i++) {
    display_time(address_elm_list[i], neighborhood_elm_list[i]);
  }
}

function display_time(address_elm, neighborhood_elm) {
  /* Displays individual commute time next to the address */

  var origin = address_from_elm(address_elm);
  var neighborhood = neighborhood_from_elm(neighborhood_elm);
  var borough = neighborhood_map[neighborhood];

  // Concat neighborhood to avoid ambiguities
  if (borough != undefined) {
    var origin = origin + ' ' + borough;
  }

  var useCache = config["use-cache"];

  if (config["mode"] == "transit") {
    transitModule.display_time(address_elm, origin, useCache);
  } else {
    // TODO
  }
}

chrome.storage.sync.get(["mode", "destination", "cache-server", "use-cache"], function(storageObj) {
  /* Check if user set options and put them in config */

  config["mode"]         = storageObj["mode"] || config["mode"];
  config["destination"]  = storageObj["destination"] || config["destination"];
  config["cache-server"] = storageObj["cache-server"] || config["cache-server"];
  config["use-cache"]    = storageObj["use-cache"] || false;

  display_times();
});
