function display_times() {
  /* Displays travel time next to all listings */

  var address_elm_list = $('.details h5');
  var neighborhood_elm_list = $('.details_info a');

  if (config['mode'] == 'transit') {
    for (var i = 0; i < address_elm_list.length; i++) {
      display_time(address_elm_list[i], neighborhood_elm_list[i]);
    }
  } else {
    display_time_list(address_elm_list, neighborhood_elm_list);
  }
}

function display_time(address_elm, neighborhood_elm) {
  /* Displays individual commute time next to the address */

  var origin = address_from_elm(address_elm);
  var borough = borough_from_elm(neighborhood_elm);

  // Concat neighborhood to avoid ambiguities
  if (borough != undefined) {
    var origin = origin + ' ' + borough;
  }

  commuteModule.display_time(address_elm, origin);

}

function display_time_list(address_elm_list, neighborhood_elm_list) {

    var origin_list = [];
    var addresses = address_elm_list.map(function(index, elm, array) { return address_from_elm(elm) });
    var boroughs = neighborhood_elm_list.map(function(index, elm, array) { return borough_from_elm(elm) });

    console.log(addresses);
    for (var i = 0; i < addresses.length; i++) {

      var origin;

      // Concat neighborhood to avoid ambiguities
      if (boroughs[i] != undefined) {
        origin = addresses[i] + ' ' + boroughs[i];
      } else {
        origin = addresses[i];
      }

      origin_list.push(origin);
    }

    commuteModule.display_time_list(address_elm_list, origin_list);
}

chrome.storage.sync.get(["mode", "cache-server"], function(storageObj) {
  /* Check if user set options and put them in config */

  config["mode"]         = storageObj["mode"] || config["mode"];
  config["cache-server"] = storageObj["cache-server"] || config["cache-server"];

  display_times();
});
