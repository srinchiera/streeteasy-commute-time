var commuteModule = (function(){

  function cache_display(elm, origin) {
    /* Displays result from cache server to DOM */

    encoded_origin = encodeURIComponent(origin);

    $.ajax({
      url: config['cache-server'] + '/' + config['mode'] + '/' + encoded_origin,
      dataType: 'json',
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("Error retrieving data from cache server!");
        error_elm(elm);
      },
      success: function(data, textStatus, jgXHR) {
        if (data['status'] == 'success') {
          append_time_to_elm(elm, data['time']);
        } else {
          error_elm(elm);
        }
      }
    });
  }

  function cache_display_list(elm_list, origins) {
    /* Displays result from cache server to DOM */

    $.ajax({
      url: config['cache-server'] + '/' + config['mode'] + '/' + origins.join('|'),
      dataType: 'json',
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("Error retrieving data from cache server!");
        error_elm_list(elm_list);
      },
      success: function(data, textStatus, jgXHR) {
        if (data['status'] == 'success') {
          append_time_to_elm_list(elm_list, data['time']);
        } else {
          error_elm_list(elm_list);
        }
      }
    });
  }

  return {
    display_time : function(elm, origin) {
      /* Public function that will append time results to DOM */

      cache_display(elm, origin);
    },

    display_time_list : function(elm_list, origin_list) {
      /* Public function that will append time results to DOM */

      cache_display_list(elm_list, origin_list);
    }
  }
})();
