function display_times() {
  /* Displays travel time next to all listings */

  var address_elm_list = $('.details h5');
  var neighborhood_elm_list = $('.details_info a');

  for (var i = 0; i < address_elm_list.length; i++) {
    display_time(address_elm_list[i], neighborhood_elm_list[i]);
  }
}

function format_origin(origin) {
  /* Specifies New York, New York in address */
  return origin + ', New York, New York';
}

function address_from_elm(elm) {
  /* Given DOM element of listing details, return origin */

  return $(elm).find('a').text();
}

function neighborhood_from_elm(elm) {
  /* Given DOM element of listing details, return origin */

  return $(elm).text();
}

function append_time_to_elm(elm, time) {
  /* Appends time string to the element */

  $(elm).append('&nbsp;&nbsp;' + time);
}

function google_api_call(elm, data) {
  /* Makes the actual API call and adds time to DOM on success */

  var wait_milliseconds = 1000;

  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/directions/json',
    data: data,
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Error retrieving data from Google Maps API!");
      console.log(errorThrown);
    },
    success: function(response, textStatus, jgXHR) {
      if (response['status'] == "OVER_QUERY_LIMIT") {
        setTimeout(function() { google_api_call(elm, data) }, wait_milliseconds);
      } else {
        var time = response['routes'][0]['legs'][0]['duration']['text'];
        append_time_to_elm(elm, time);
      }
    },
  });
}

function google_api_display(elm, origin) {
  /* Dispalys result from Google Maps API call to DOM */

  var origin = format_origin(origin);

  var data = {
    'key': config['api_key'],
    'origin': origin,
    'destination': config['destination'],
    'sensor': false,
    'mode': 'transit',
    'arrival_time': '1400749479',
  }

  google_api_call(elm, data);
}

function cache_display(elm, origin) {
  /* Displays result from cache server to DOM */

  encoded_origin = encodeURIComponent(origin);

  $.ajax({
    url: config['cache-server'] + '/' + encoded_origin,
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Error retrieving data from cache server!");
      console.log(errorThrown);
    },
    success: function(data, textStatus, jgXHR) {
      if (data['status'] == 'success') {
        append_time_to_elm(elm, data['time']);
      } else {
        google_api_display(elm, origin);
      }
    }
  });
}

function display_time(address_elm, neighborhood_elm) {

  var origin = address_from_elm(address_elm);
  var neighborhood = neighborhood_from_elm(neighborhood_elm);
  var borough = neighborhood_map[neighborhood];

  // Concat neighborhood to avoid ambiguities
  if (borough != undefined) {
    var origin = origin + ' ' + borough;
  }

  cache_display(address_elm, origin);
}

display_times();
