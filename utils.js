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

function borough_from_elm(elm) {
  /* Given DOM element of listing details, return origin */

  return neighborhood_map[neighborhood_from_elm(elm)];
}

function append_time_to_elm(elm, time) {
  /* Appends time string to the element */

  $(elm).append('&nbsp;&nbsp;' + time);
}

function append_time_to_elm_list(elm_list, time_list) {
  /* Appends time string to the element */

  for (var i = 0; i < elm_list.length; i++) {
    append_time_to_elm(elm_list[i], time_list[i]);
  }
}

function error_elm(elm) {
  /* Appends time string to the element */

  $(elm).append('&nbsp;&nbsp;' + 'Commute time unavailible');
}

function error_elm_list(elm_list) {
  /* Appends time string to the element */

  for (var i = 0; i < elm_list.length; i++) {
    error_elm(elm_list[i]);
  }
}

