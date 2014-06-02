var transitModule = (function(){

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
        google_api_display(elm, origin);
      },
      success: function(data, textStatus, jgXHR) {
        if (data['status'] == 'success') {
          append_time_to_elm(elm, data['time']);
        } else {
          alert('failed this');
          google_api_display(elm, origin);
        }
      }
    });
  }

  return {
    display_time : function(elm, origin, use_cache) {
      /* Public function that will append time results to DOM */

      if (use_cache) {
        cache_display(elm, origin);
      } else {
        google_api_display(elm, origin);
      }
    }
  }

})();
