(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.ck || (g.ck = {})).datasets = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var lodash = (typeof window !== "undefined" ? window['lodash'] : typeof global !== "undefined" ? global['lodash'] : null),
    jquery = (typeof window !== "undefined" ? window['jquery'] : typeof global !== "undefined" ? global['jquery'] : null),
    ckan = (typeof window !== "undefined" ? window['ckan'] : typeof global !== "undefined" ? global['ckan'] : null);

var config = {};

/* Support function to publish data to page */
function generateView(div, url, packages) {

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
      fragments.push(template({ ds: ds }));
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
      .addClass('ckan-embed')
      .html(''); // clear container

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW1iZWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGxvZGFzaCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Wydsb2Rhc2gnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2xvZGFzaCddIDogbnVsbCksXG4gICAganF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pxdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnanF1ZXJ5J10gOiBudWxsKSxcbiAgICBja2FuID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2NrYW4nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2NrYW4nXSA6IG51bGwpO1xuXG52YXIgY29uZmlnID0ge307XG5cbi8qIFN1cHBvcnQgZnVuY3Rpb24gdG8gcHVibGlzaCBkYXRhIHRvIHBhZ2UgKi9cbmZ1bmN0aW9uIGdlbmVyYXRlVmlldyhkaXYsIHVybCwgcGFja2FnZXMpIHtcblxuICAvLyBHZW5lcmF0ZSBIVE1MIG9mIHRoZSB3aWRnZXRcbiAgdmFyIHRlbXBsYXRlID0gXy50ZW1wbGF0ZShcbiAgICAnPGRpdiBjbGFzcz1cImNrYW4tZGF0YXNldFwiPicgK1xuICAgICc8YSBocmVmPVwiPCU9IGRzLnVybCAlPlwiPicgK1xuICAgICc8aDU+PCU9IGRzLnRpdGxlICU+PC9oNT4nICtcbiAgICAnPC9hPicgK1xuICAgICc8cD48JT0gZHMuZGVzY3JpcHRpb24gJT48L3A+JyArXG4gICAgJzxiPjwlPSBkcy5ncm91cG5hbWUgJT48L2I+PGJyPicgK1xuICAgICc8c21hbGw+PCU9IGRzLmZvcm1hdHMgJT48L3NtYWxsPicgK1xuICAgIC8vJzxzbWFsbD48JT0gZHMubW9kaWZpZWQgJT48L3NtYWxsPicgK1xuICAgICc8L2Rpdj4nXG4gICk7XG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9ucyB0byBtYXNzYWdlIHRoZSByZXN1bHRzXG4gIHZhciBmcmFnbWVudHMgPSBbXTtcbiAgdmFyIGdldExhbmdEZWZhdWx0ID0gZnVuY3Rpb24obikge1xuICAgIHJldHVybiBuLmZyIHx8IG4uZGUgfHwgbi5pdCB8fCBuLmVuO1xuICB9O1xuICB2YXIgZ2V0RGF0YXNldEZvcm1hdHMgPSBmdW5jdGlvbihyZXMpIHtcbiAgICByZXR1cm4gXy51bmlxKF8ubWFwKHJlcyxcbiAgICAgIGZ1bmN0aW9uKHIpIHsgcmV0dXJuIHIuZm9ybWF0IH0pKVxuICAgICAgLmpvaW4oJyAnKTtcbiAgICB9O1xuXG4gICAgLy8gUGFzcyB0aGUgZGF0YXNldCByZXN1bHRzIHRvIHRoZSB0ZW1wbGF0ZVxuICAgIGZvciAodmFyIGkgaW4gcGFja2FnZXMpIHtcbiAgICAgIHZhciBkc28gPSBwYWNrYWdlc1tpXTtcbiAgICAgIHZhciBkcyA9IHtcbiAgICAgICAgdXJsOiAgICAgICAgICAgdXJsICsgJ2VuL2RhdGFzZXQvJyArIGRzby5uYW1lLFxuICAgICAgICB0aXRsZTogICAgICAgICBnZXRMYW5nRGVmYXVsdChkc28uZGlzcGxheV9uYW1lKSxcbiAgICAgICAgZ3JvdXBuYW1lOiAgICAgKGRzby5ncm91cHMubGVuZ3RoID09IDApID8gJycgOlxuICAgICAgICBnZXRMYW5nRGVmYXVsdChkc28uZ3JvdXBzWzBdLmRpc3BsYXlfbmFtZSksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAgIGdldExhbmdEZWZhdWx0KGRzby5kZXNjcmlwdGlvbiksXG4gICAgICAgIGZvcm1hdHM6ICAgICAgIGdldERhdGFzZXRGb3JtYXRzKGRzby5yZXNvdXJjZXMpLFxuICAgICAgICBtb2RpZmllZDogICAgICBkc28ubWV0YWRhdGFfbW9kaWZpZWRcbiAgICAgIH07XG4gICAgICBmcmFnbWVudHMucHVzaCh0ZW1wbGF0ZSh7IGRzOiBkcyB9KSk7XG4gICAgfVxuXG4gICAgaWYgKGZyYWdtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZyYWdtZW50cyA9IFsnTm8gcmVzdWx0cyddO1xuICAgIH1cblxuICAgIC8vIEluc2VydCBpbnRvIHRoZSBjb250YWluZXIgb24gdGhlIHBhZ2VcbiAgICBkaXYuaHRtbChmcmFnbWVudHMuam9pbignJykpO1xuXG4gIH1cblxuLy8gRW1iZWQgYSBDS0FOIGRhdGFzZXQgcmVzdWx0IGluIGEgd2ViIHBhZ2UuXG4vLyBlbDogRE9NIGVsZW1lbnQgaW4gd2hpY2ggdG8gcGxhY2UgY29tcG9uZW50IChET00gbm9kZSBvciBDU1Mgc2VsZWN0b3IpXG4vLyB1cmw6IFNvdXJjZSBwb3J0YWwgKFVSTCBzdHJpbmcpXG4vLyBxdWVyeTogUGFyYW1ldGVycyBmb3IgQ0tBTiBBUEkgKG9iamVjdCkgb3Igc2VhcmNoIHF1ZXJ5IChzdHJpbmcpXG4vLyBjYWxsYmFjazogaW52b2tlZCB3aXRoIHRoZSBsb2FkZWQgQ0tBTiBjbGllbnRcbmZ1bmN0aW9uIGRhdGFzZXRzKGVsLCB1cmwsIHF1ZXJ5LCBjYWxsYmFjaykge1xuICB2YXIgY2IgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpe30sXG4gICAgICBjbGllbnQsIGNvbmZpZywgcGFja2FnZXMsIGpzb25wO1xuXG4gIHRyeSB7XG4gICAgLy8gUGFyc2UgQ0tBTiBxdWVyeVxuICAgIGlmIChfLmlzU3RyaW5nKHF1ZXJ5KSkge1xuICAgICAgY29uZmlnID0geyBxOiBxdWVyeSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maWcgPSBxdWVyeTtcbiAgICB9XG4gICAgaWYgKF8uaXNVbmRlZmluZWQoY29uZmlnLnNvcnQpKSB7XG4gICAgICBjb25maWcuc29ydCA9ICdtZXRhZGF0YV9tb2RpZmllZCBkZXNjJztcbiAgICB9XG4gICAgaWYgKF8uaXNVbmRlZmluZWQoY29uZmlnLmpzb25wKSkge1xuICAgICAganNvbnAgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBqc29ucCA9IGNvbmZpZy5qc29ucDtcbiAgICAgIGRlbGV0ZSBjb25maWcuanNvbnA7XG4gICAgfVxuXG4gICAgLy8gZW5zdXJlIGNvbnRhaW5lciBkaXYgaGFzIGNsYXNzXG4gICAgdmFyIGRpdiA9ICQoZWwpXG4gICAgICAuYWRkQ2xhc3MoJ2NrYW4tZW1iZWQnKVxuICAgICAgLmh0bWwoJycpOyAvLyBjbGVhciBjb250YWluZXJcblxuICAgIC8vIGNyZWF0ZSBhIGNsaWVudFxuICAgIHZhciBjbGllbnQgPSBuZXcgQ0tBTi5DbGllbnQodXJsKTtcbiAgICB2YXIgYWN0aW9uID0gJ3BhY2thZ2Vfc2VhcmNoJztcblxuICAgIC8vIGV4dGVuZCBja2FuLmpzIGFjdGlvbiByb3V0aW5lIHdpdGgganNvbnAgc3VwcG9ydFxuICAgIGlmIChqc29ucCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHVybDogY2xpZW50LmVuZHBvaW50ICsgJy8zL2FjdGlvbi8nICsgYWN0aW9uLFxuICAgICAgICBkYXRhOiBjb25maWcsIGRhdGFUeXBlOiBcImpzb25wXCIsXG4gICAgICAgIHR5cGU6ICdQT1NUJywgY2FjaGU6IHRydWVcbiAgICAgIH07XG5cbiAgICAgICQuYWpheChvcHRpb25zKVxuICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGlmIChlcnIgIT0gbnVsbCkgeyBjYihlcnIpOyByZXR1cm47IH1cbiAgICAgIH0pXG4gICAgICAuZG9uZShmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgcGFja2FnZXMgPSByZXMucmVzdWx0LnJlc3VsdHM7XG4gICAgICAgIGdlbmVyYXRlVmlldyhkaXYsIHVybCwgcGFja2FnZXMpO1xuXG4gICAgICAgIGNiKG51bGwsIHtjbGllbnQ6IGNsaWVudCwgY29uZmlnOiBjb25maWcsIHBhY2thZ2VzOiBwYWNrYWdlc30pO1xuICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcmVjb21tZW5kZWQgZGVmYXVsdCB1c2FnZSBvZiBja2FuLmpzLCBlLmcuIHRocm91Z2ggQ09SUyBvciBwcm94eVxuICAgICAgY2xpZW50LmFjdGlvbihhY3Rpb24sIGNvbmZpZywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVyciAhPSBudWxsKSB7IGNiKGVycik7IHJldHVybjsgfVxuICAgICAgICBwYWNrYWdlcyA9IHJlcy5yZXN1bHQucmVzdWx0cztcbiAgICAgICAgZ2VuZXJhdGVWaWV3KGRpdiwgdXJsLCBwYWNrYWdlcyk7XG5cbiAgICAgICAgY2IobnVsbCwge2NsaWVudDogY2xpZW50LCBjb25maWc6IGNvbmZpZywgcGFja2FnZXM6IHBhY2thZ2VzfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfSBjYXRjaCAoZXJyKSB7IGNiKGVycik7IH1cbn1cblxuLy8gbWFrZSBjb25maWcgZXh0ZXJuYWxseSB2aXNpYmxlXG5kYXRhc2V0cy5jb25maWcgPSBjb25maWc7XG5cbm1vZHVsZS5leHBvcnRzID0gZGF0YXNldHM7XG4iXX0=
