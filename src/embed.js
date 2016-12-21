var _ = require('underscore'),
    $ = require('jquery'),
    CKAN = require('ckan');

var config = {};

/* Support function to publish data to page */
function generateView(div, url, packages) {

  // Generate HTML of the widget
  var template_widget = _.template(
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
    for (var i in packages) {
      var dso = packages[i];
      var ds = {
        url:           url + 'en/dataset/' + dso.name,
        title:         getLangDefault(dso.display_name),
        groupname:     (dso.groups.length == 0) ? '' :
        getLangDefault(dso.groups[0].display_name),
        description:   getLangDefault(dso.description),
        formats:       getDatasetFormats(dso.resources),
        modified:      dso.metadata_modified
      };
      fragments.push(template_widget({ ds: ds }));
    }

    if (fragments.length === 0) {
      fragments = ['No results'];
    }

    // Insert into the container on the page
    div.html(fragments.join(''));

  }

// Embed a CKAN dataset result in a web page.
// el: DOM element in which to place component (DOM node or CSS selector)
// url: Source portal (URL string)
// query: Parameters for CKAN API (object) or search query (string)
// callback: invoked with the loaded CKAN client
function datasets(el, url, query, callback) {
  var cb = callback || function(){},
      client, config, packages, jsonp;

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
    if (_.isUndefined(config.jsonp)) {
      jsonp = true;
    } else {
      jsonp = config.jsonp;
      delete config.jsonp;
    }

    // ensure container div has class
    var div = $(el)
      .addClass('ckan-embed');

    // create a client
    var client = new CKAN.Client(url);
    var action = 'package_search';

    // extend ckan.js action routine with jsonp support
    if (jsonp) {
      var options = {
        url: client.endpoint + '/3/action/' + action,
        data: config, dataType: "jsonp",
        type: 'POST', cache: true
      };

      $.ajax(options)
      .fail(function(err) {
        if (err != null) { cb(err); return; }
      })
      .done(function(res) {
        packages = res.result.results;
        generateView(div, url, packages);

        cb(null, {client: client, config: config, packages: packages});
      });

    } else {
      // recommended default usage of ckan.js, e.g. through CORS or proxy
      client.action(action, config, function(err, res) {
        if (err != null) { cb(err); return; }
        packages = res.result.results;
        generateView(div, url, packages);

        cb(null, {client: client, config: config, packages: packages});
      });
    }

  } catch (err) { cb(err); }
}

// make config externally visible
datasets.config = config;

module.exports = datasets;
