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

