var _ = require('underscore'),
    $ = require('jquery'),
    CKAN = require('ckan');
var CKANembed = {};
module.exports = CKANembed;

// Module container
(function(embed) {

var CKANclient = null;

// Default HTML format of the widget
function defaultTemplate() {
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

// Adapted from epeli/underscore.string
function truncate(str, length, truncateStr) {
  str = (str == null) ? '' : '' + str;
  truncateStr = truncateStr || '...';
  length = ~~length;
  return str.length > length ? str.slice(0, length) + truncateStr : str;
}

/* Support function to publish data to page */
function generateView(url, packages, options) {

  // Generate HTML of the widget
  var template_widget = options.template;

  // Helper functions to massage the results
  var lang = options.lang;
  var fragments = [];
  var getLangDefault = function(n) {
    if (lang !== null && n[lang]) return n[lang];
    return n.fr || n.de || n.it || n.en || n || '';
  };
  var getDatasetFormats = function(res) {
    return _.uniq(_.map(res,
      function(r) { return r.format; }))
      .join(' ');
    };

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  // adjust url for language support
  if (lang !== null && !endsWith(url, lang + '/'))
    url = url + lang + '/';

  // Pass the dataset results to the template
  for (var i in packages) {
    var dso = packages[i];
    var dsogroupname = (dso.groups.length === 0) ? '' :
          Object.keys(dso.groups[0].display_name).length ?
            getLangDefault(dso.groups[0].display_name) :
            getLangDefault(dso.groups[0].title);
    var ds = {
      url:           url + 'dataset/' + dso.name,
      title:         Object.keys(dso.display_name).length ?
                      getLangDefault(dso.display_name) :
                      getLangDefault(dso.title),
      groupname:     dsogroupname,
      description:   getLangDefault(dso.description),
      formats:       getDatasetFormats(dso.resources),
      modified:      dso.metadata_modified
    };
    fragments.push(template_widget({ ds: ds, dso: dso }));
  }

  if (fragments.length === 0) return null;
  return fragments.join('');

} // -generateView

// Parse query into a CKAN request
function parametrize(options) {
  var request = {};
  if (_.isString(options)) {
    request.q = options;
    options = {};
  } else {
    if (!_.isUndefined(options.q)) {
      request.q = options.q;
    } else if (!_.isUndefined(options.fq)) {
      request.fq = options.fq;
    } else {
      // No query provided
      return null;
    }
  }
  // Default sort order is by descending modified date
  request.sort = _.isUndefined(options.sort) ?
    'metadata_modified desc' : options.sort;
  // Fetches 5 rows by default
  request.rows = _.isUndefined(options.rows) ?
    5 : options.rows;

  // parse configuration options
  options.jsonp = _.isUndefined(options.jsonp) ?
    true : options.jsonp;
  options.proxy = _.isUndefined(options.proxy) ?
    null : options.proxy;
  options.lang = _.isUndefined(options.lang) ?
    null : options.lang;
  options.template = _.isUndefined(options.template) ?
    defaultTemplate() : _.template(options.template);
  options.noresult = _.isUndefined(options.noresult) ?
    'No datasets found' : options.noresult;

  return { 'request': request, 'options': options };
}

// Processes results of a request with package data
function showPackages(request, url, packages, options, div, cb) {
  // Create a result set
  var res2 = generateView(url, packages, options);
  // Insert into container on page
  div.html(res2 ? res2 : options.noresult);
  // Continue with callback
  cb(null, {client: CKANclient, request: request, packages: packages});
}

// Embed a CKAN dataset result in a web page.
// el: DOM element in which to place component (DOM node or CSS selector)
// url: Source portal (URL string)
// options: Parameters for CKAN API package_search (object) or search query (string)
// callback: invoked with the loaded CKAN client
embed.search = function (el, url, options, callback) {
  var cb = callback || function(){};

  try {
    var p = parametrize(options);
    if (p === null)
      return cb('Please provide a query');

    options = p.options;
    var request = p.request;
    var action = 'package_search';

    // ensure container div has class
    var div = $(el).addClass('ckan-embed');

    // initialize client if needed
    if (!CKANclient)
      CKANclient = new CKAN.Client(options.proxy || url);

    // extend ckan.js action routine with jsonp support - requires jQuery to be available
    if (options.jsonp) {
      request = {
        url: CKANclient.endpoint + '/3/action/' + action,
        data: request, dataType: "jsonp",
        type: 'POST', cache: true
      };

      $.ajax(request)
      .fail(function(err) {
        if (err !== null) { cb(err); return; }
      })
      .done(function(res) {
        showPackages(request, url, res.result.results, options, div, cb);
      });

    } else {
      // recommended default usage of ckan.js, e.g. through CORS or proxy
      client.action(action, request, function(err, res) {
        if (err !== null) { cb(err); return; }
        showPackages(request, url, res.result.results, options, div, cb);
      });
    }

  } catch (err) { cb(err); }
}; //-search
embed.datasets = embed.search; // compatibility

// Embed a single CKAN dataset in a web page.
// el: DOM element in which to place component (DOM node or CSS selector)
// url: Link to dataset or root of the portal (URL string)
// id: Parameter for CKAN package_show API (dataset by ID) if not in url
// callback: invoked with the loaded CKAN client
embed.dataset = function (el, url, id, callback) {
  var cb = callback || function(){};

  try {
    if (!url) {
      console.warn('No URL provided for embedding');
      return cb('Please provide a URL link');
    }
    if (!id) {
      var dsl = url.split('/dataset/');
      if (dsl.length) {
        id = dsl[1];
        url = dsl[0];
        if (id.indexOf('/') > 0) {
          id = id.split('/')[0];
        }
      } else {
        console.warn('Invalid URL:', url);
      }
      if (!id) {
        console.warn('Invalid URL:', url);
        return cb('Please provide an ID or link to a dataset');
      }
    }

    console.log('Embedding:', url, id)

    // initialize client if needed
    if (!CKANclient)
      CKANclient = new CKAN.Client(options.proxy || url);

    // ensure container div has class
    var div = $(el).addClass('ckan-embed');

    // create a client
    var action = 'package_show';

    // extend ckan.js action routine with jsonp support
    if (options.jsonp) {
      request = {
        url: CKANclient.endpoint + '/3/action/' + action,
        data: request, dataType: "jsonp",
        type: 'POST', cache: true
      };

      $.ajax(request)
      .fail(function(err) {
        if (err !== null) { cb(err); return; }
      })
      .done(function(res) {
        showPackages(request, url, [ res.result ], options, div, cb);
      });

    } else {
      // recommended default usage of ckan.js, e.g. through CORS or proxy
      client.action(action, request, function(err, res) {
        if (err !== null) { console.warn(err); cb(err); return; }
        showPackages(request, url, [ res.result ], options, div, cb);
      });
    }

  } catch (err) { cb(err); }
}; //-dataset

// Export utilities, for testing:

embed.truncate = truncate;
embed.parametrize = parametrize;
embed.generateView = generateView;

}(CKANembed));
