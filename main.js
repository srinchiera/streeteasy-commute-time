function display_times() {
  /* Displays travel time next to all listings */

  var details_list = $('.details h5');

  for (var i = 0; i < details_list.length; i++) {
    display_time(details_list[i]);
  }
}

function format_origin(origin) {
  /* Specifies New York, New York in address */
  return origin + ', New York, New York';
}

function origin_from_elm(elm) {
  /* Given DOM element of listing details, return origin */

  return $(elm).find('a').text();
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

function google_api_display(elm) {
  /* Dispalys result from Google Maps API call to DOM */

  var unformatted_origin = origin_from_elm(elm);
  var origin = format_origin(unformatted_origin);

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

function cache_display(elm) {
  /* Displays result from cache server to DOM */

  var origin = origin_from_elm(elm);
  encoded_origin = encodeURIComponent(origin)
  $.ajax({
    url: 'http://localhost/' + encoded_origin,
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Error retrieving data from cache server!");
      console.log(errorThrown);
    },
    success: function(data, textStatus, jgXHR) {
      if (data['status'] == 'success') {
        append_time_to_elm(elm, data['time']);
      } else {
        google_api_display(elm);
      }
    }
  });
}

function display_time(elm) {
  cache_display(elm);
}

display_times();
