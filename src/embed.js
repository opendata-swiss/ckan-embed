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
    '<small><b><%= ds.groupname %></b></small>' +
    '<p><%= ds.description %></p>' +
    '<small><%= ds.formats %> &bull; <%= ds.license %></small>' +
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

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function validate(str) {
  let regex = /^[\p{L}\p{N} \\-]+$/u;
  return regex.test(str);
}

/* Support function to publish data to page */
function generateView(url, packages, options) {

  // Generate HTML of the widget
  var template_widget = options.template;

  // Helper functions to massage the results
  var lang = options.lang;
  var fragments = [];
  var hasObjKey = function(o, k) {
    return (Object.keys(o).indexOf(k) > -1)
      && o[k] !== null && o[k] !== '' && o[k] != {};
  }
  var getLangDefault = function(n) {
    if (typeof n === 'undefined') return '';
    if (typeof n === 'string') return n;
    if (lang !== null && hasObjKey(n, lang)) return n[lang];
    return n.fr || n.de || n.it || n.en || '';
  };
  var getDatasetFormats = function(res) {
    return _.uniq(_.map(res,
      function(r) { return r.format; }))
      .join(' ');
  };

  // adjust url for language support
  if (lang !== null && !endsWith(url, lang + '/'))
    url = url + lang + '/';

  // Pass the dataset results to the template
  for (var i in packages) {
    var dso = packages[i];
    var dsogroupname = (dso.groups.length === 0) ? '' :
          hasObjKey(dso.groups[0], 'display_name') ?
            getLangDefault(dso.groups[0].display_name) :
            getLangDefault(dso.groups[0].title);
    var dsotitle = getLangDefault(dso.display_name) ||
                   getLangDefault(dso.title) || '';
    var dsonotes = getLangDefault(dso.description) ||
                   getLangDefault(dso.notes) || '';
    var dsolicense = dso.license_id || dso.license_title || dso.license || '';
    var ds = {
      url:           url + 'dataset/' + dso.name,
      title:         dsotitle,
      groupname:     dsogroupname,
      description:   dsonotes,
      formats:       getDatasetFormats(dso.resources),
      modified:      dso.metadata_modified,
      license:       dsolicense
    };
    fragments.push(template_widget({ ds: ds, dso: dso }));
  }

  if (fragments.length === 0) return null;
  return fragments.join('');

} // -generateView

// Parse URL into dataset query
function urlToDataset(url) {
  var id = null;
  var dsl = url.split('/dataset/');
  if (dsl.length == 2) {
    id = dsl[1];
    // The dataset identifier is the last part of the path (usually)
    if (id.indexOf('/') > 0) {
      id = id.split('/')[0];
    }
    url = dsl[0];
    // Keep only first part of URL (without language extension)
    if (url.lastIndexOf('/') > 10) {
      url = url.replace('//', '\\').split('/')[0].replace('\\', '//');
    }
    if (!url.endsWith('/')) url += '/';
  } else {
    return null;
  }
  return {'id': id, 'url': url};
}

// Parse query into a CKAN request
function parametrize(options) {
  var request = {};
  if (_.isString(options)) {
    request.q = options;
    options = {};
    if (!validate(request.q)) return null;
  } else {
    if (_.isUndefined(options)) {
      return null;
    } else if (!_.isUndefined(options.q)) {
      request.q = options.q;
      if (!validate(request.q)) return null;
    } else if (!_.isUndefined(options.fq)) {
      request.fq = options.fq;
    } else if (!_.isUndefined(options.id)) {
      request.id = options.id;
    } else {
      // No query provided
      return null;
    }
  }

  // For queries only
  if (_.isUndefined(request.id)) {

    // Default sort order is by descending modified date
    request.sort = _.isUndefined(options.sort) ?
      'metadata_modified desc' : options.sort;
    // Fetches 5 rows by default
    request.rows = _.isUndefined(options.rows) ?
      5 : options.rows;
  }

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
  var cb = callback || function(e){ if (e) console.error(e); };

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
embed.dataset = function (el, url, options, callback) {
  var cb = callback || function(){};

  options = options || {};
  if (_.isUndefined(options.id) && !_.isUndefined(url)) {
    var u = urlToDataset(url);
    options.id = u.id;
    url = u.url;
  }

  var p = parametrize(options);
  if (p === null)
    return cb('Please provide a URL, or id in your options');

  options = p.options;
  var request = p.request;

  try {
    if (!url) {
      console.warn('No URL provided for embedding');
      return cb('Please provide a URL link');
    }
    if (!request.id) {

      if (!request.id) {
        console.warn('Invalid URL or no ID provided:', url);
        return cb('Please provide an ID or link to a dataset');
      }
    }
    // console.debug('Embedding:', url, request.id);

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
        if (err !== null) { cb(err); return; }
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
