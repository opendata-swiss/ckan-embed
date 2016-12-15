var lodash = require('lodash'),
    jquery = require('jquery'),
    ckan = require('ckan');

var config = {};

/* Support function to publish data to page */
function generateView(ckandata) {

  var datasets = ckandata.result.results;
  console.debug(datasets);

  // Generate HTML of the widget
  var template = _.template(
    '<div class="ckan-dataset">' +
    '<a href="<%= ds.url %>">' +
    '<h5><%= ds.title %></h5>' +
    '</a>' +
    '<p><%= ds.description %></p>' +
    '<b><%= ds.groupname %></b><br>' +
    '<small><%= ds.formats %></small>' +
    //'<small><%= ds.modified %></small>' +
    '</div>'
  );

  // Helper functions to massage the results
  var fragments = [];
  var getLangDefault = function(n) {
    return n.fr || n.de || n.it || n.en;
  };
  var getDatasetFormats = function(res) {
    return _.uniq(_.map(res,
      function(r) { return r.format }))
      .join(' ');
    };

    // Pass the dataset results to the template
    for (var i in datasets) {
      var dso = datasets[i];
      var ds = {
        url:           url + 'en/dataset/' + dso.name,
        title:         getLangDefault(dso.display_name),
        groupname:     (dso.groups.length == 0) ? '' :
        getLangDefault(dso.groups[0].display_name),
        description:   getLangDefault(dso.description),
        formats:       getDatasetFormats(dso.resources),
        modified:      dso.metadata_modified
      };
      fragments.push(template({ ds: ds }));
    }

    // Insert into the container on the page
    div.html(fragments.join(''));

  }

// Embed a CKAN result in a web page.
// el: DOM element in which to place component (DOM node or CSS selector)
// url: Source portal (URL string)
// query: Parameters for CKAN API (object) or search query (string)
// callback: invoked with the loaded CKAN client
function embed(el, url, query, callback) {
  var cb = callback || function(){},
      client, config, action;

  try {
    // Parse CKAN query
    if (_.isString(query)) {
      config = { q: query };
    } else {
      config = query;
    }
    if (_.isUndefined(config.sort)) {
      config.sort = 'metadata_modified desc';
    }
    if (_.isUndefined(config.action)) {
      action = 'package_search';
    } else {
      action = config.action;
    }
    if (_.isUndefined(config.jsonp)) {
      config.jsonp = true;
    }

    // ensure container div has class
    var div = $(el)
      .addClass('ckan-embed')
      .html(''); // clear container

    // create a client
    var client = new CKAN.Client(url);

    // extend ckan.js action routine with jsonp support
    if (config.jsonp) {
      if (action.indexOf('dataset_' === 0)) {
        action = action.replace('dataset_', 'package_');
      }
      var options = {
        url: client.endpoint + '/3/action/' + action,
        data: config, dataType: "jsonp",
        type: 'POST', cache: true
      };

      $.ajax(options)
      .fail(function(err) {
        if (err != null) { cb(err); return; }
      })
      .done(generateView);

    } else {
      // recommended default usage of ckan.js, e.g. through CORS or proxy
      client.action(action, config, function(err, result) {
        if (err != null) { cb(err); return; }

        generateView(result);
      });
    }

  cb(null, {client: client, config: config});
  } catch (err) { cb(err); }

}

// make config externally visible
embed.config = config;

module.exports = embed;
