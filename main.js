var details_list = $('.details h5');

for (var i = 0; i < details_list.length; i++) {
  fill_time(details_list[i]);
}

function format_origin(origin) {
// Specifies New York, New York in address
  return origin + ', New York, New York';
}

function fill_time(elm) {

  var origin = format_origin($(elm).find('a').text())
  console.log(origin);

  var data = {
    'key': config['api_key'],
    'origin': origin,
    'destination': config['destination'],
    'sensor': false,
    'mode': 'transit',
    'arrival_time': '1400749479',
  }

  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/directions/json',
    data: data,
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Google Maps API error!");
      console.log(errorThrown);
    },
    success: function(data, textStatus, jgXHR) {
      console.log(data);
      var time = data['routes'][0]['legs'][0]['duration'];
      $(elm).append('&nbsp;&nbsp;' + time['text']);
    },
  });
}
