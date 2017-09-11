var _ = require('underscore'),
    $ = require('jquery'),
    CKAN = require('ckan');

var config = {};

/* Support function to publish data to page */
function generateView(div, url, packages, lang) {

  // Generate HTML of the widget
  var template_widget = template();

  // Helper functions to massage the results
  var fragments = [];
  var getLangDefault = function(n) {
    if (lang !== null && n[lang]) return n[lang];
    return n.fr || n.de || n.it || n.en;
  };
  var getDatasetFormats = function(res) {
    return _.uniq(_.map(res,
      function(r) { return r.format; }))
      .join(' ');
    };

  // adjust url for language support
  if (lang !== null) url = url + lang + '/';

  // Pass the dataset results to the template
  for (var i in packages) {
    var dso = packages[i];
    var dsogroupname = (dso.groups.length === 0) ? '' :
          getLangDefault(dso.groups[0].display_name);
    var ds = {
      url:           url + 'dataset/' + dso.name,
      title:         getLangDefault(dso.display_name),
      groupname:     dsogroupname,
      description:   getLangDefault(dso.description),
      formats:       getDatasetFormats(dso.resources),
      modified:      dso.metadata_modified
    };
    fragments.push(template_widget({ ds: ds, dso: dso }));
  }

  if (fragments.length === 0) {
    fragments = ['No results'];
  }

  // Insert into the container on the page
  div.html(fragments.join(''));

}

function template() {
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
  return template_widget;
}

// Embed a CKAN dataset result in a web page.
// el: DOM element in which to place component (DOM node or CSS selector)
// url: Source portal (URL string)
// options: Parameters for CKAN API (object) or search query (string)
// callback: invoked with the loaded CKAN client
function datasets(el, url, options, callback) {
  var cb = callback || function(){},
      request = {}, client, packages;

  try {
    // parse CKAN query
    if (_.isString(options)) {
      request.q = options;
      options = {};
    } else {
      if (!_.isUndefined(options.q)) {
        request.q = options.q;
      } else if (!_.isUndefined(options.fq)) {
        request.fq = options.fq;
      } else {
        cb('Please provide a query'); return;
      }
    }
    request.sort = _.isUndefined(options.sort) ?
      'metadata_modified desc' : options.sort;
    request.rows = _.isUndefined(options.rows) ?
      5 : options.rows;

    // parse configuration options
    options.jsonp = _.isUndefined(options.jsonp) ?
      true : options.jsonp;
    options.proxy = _.isUndefined(options.proxy) ?
      null : options.proxy;
    options.lang = _.isUndefined(options.lang) ?
      'en' : options.lang;

    // ensure container div has class
    var div = $(el).addClass('ckan-embed');

    // create a client
    client = new CKAN.Client(options.proxy || url);
    var action = 'package_search';

    // extend ckan.js action routine with jsonp support
    if (options.jsonp) {
      request = {
        url: client.endpoint + '/3/action/' + action,
        data: request, dataType: "jsonp",
        type: 'POST', cache: true
      };

      $.ajax(request)
      .fail(function(err) {
        if (err !== null) { cb(err); return; }
      })
      .done(function(res) {
        packages = res.result.results;
        generateView(div, url, packages, options.lang);

        cb(null, {client: client, request: request, packages: packages});
      });

    } else {
      // recommended default usage of ckan.js, e.g. through CORS or proxy
      client.action(action, request, function(err, res) {
        if (err !== null) { cb(err); return; }
        packages = res.result.results;
        generateView(div, url, packages, options.lang);

        cb(null, {client: client, request: request, packages: packages});
      });
    }

  } catch (err) { cb(err); }
}

exports.datasets = datasets;
exports.template = template;
exports.generateView = generateView;
