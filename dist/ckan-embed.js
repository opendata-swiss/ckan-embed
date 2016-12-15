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
      });

    } else {
      // recommended default usage of ckan.js, e.g. through CORS or proxy
      client.action(action, config, function(err, res) {
        if (err != null) { cb(err); return; }
        packages = res.result.results;
        generateView(div, url, packages);
      });
    }

  cb(null, {client: client, config: config, packages: packages});
  } catch (err) { cb(err); }

}

// make config externally visible
datasets.config = config;

module.exports = datasets;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW1iZWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgbG9kYXNoID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2xvZGFzaCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnbG9kYXNoJ10gOiBudWxsKSxcbiAgICBqcXVlcnkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snanF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqcXVlcnknXSA6IG51bGwpLFxuICAgIGNrYW4gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snY2thbiddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnY2thbiddIDogbnVsbCk7XG5cbnZhciBjb25maWcgPSB7fTtcblxuLyogU3VwcG9ydCBmdW5jdGlvbiB0byBwdWJsaXNoIGRhdGEgdG8gcGFnZSAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVWaWV3KGRpdiwgdXJsLCBwYWNrYWdlcykge1xuXG4gIC8vIEdlbmVyYXRlIEhUTUwgb2YgdGhlIHdpZGdldFxuICB2YXIgdGVtcGxhdGUgPSBfLnRlbXBsYXRlKFxuICAgICc8ZGl2IGNsYXNzPVwiY2thbi1kYXRhc2V0XCI+JyArXG4gICAgJzxhIGhyZWY9XCI8JT0gZHMudXJsICU+XCI+JyArXG4gICAgJzxoNT48JT0gZHMudGl0bGUgJT48L2g1PicgK1xuICAgICc8L2E+JyArXG4gICAgJzxwPjwlPSBkcy5kZXNjcmlwdGlvbiAlPjwvcD4nICtcbiAgICAnPGI+PCU9IGRzLmdyb3VwbmFtZSAlPjwvYj48YnI+JyArXG4gICAgJzxzbWFsbD48JT0gZHMuZm9ybWF0cyAlPjwvc21hbGw+JyArXG4gICAgLy8nPHNtYWxsPjwlPSBkcy5tb2RpZmllZCAlPjwvc21hbGw+JyArXG4gICAgJzwvZGl2PidcbiAgKTtcblxuICAvLyBIZWxwZXIgZnVuY3Rpb25zIHRvIG1hc3NhZ2UgdGhlIHJlc3VsdHNcbiAgdmFyIGZyYWdtZW50cyA9IFtdO1xuICB2YXIgZ2V0TGFuZ0RlZmF1bHQgPSBmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuIG4uZnIgfHwgbi5kZSB8fCBuLml0IHx8IG4uZW47XG4gIH07XG4gIHZhciBnZXREYXRhc2V0Rm9ybWF0cyA9IGZ1bmN0aW9uKHJlcykge1xuICAgIHJldHVybiBfLnVuaXEoXy5tYXAocmVzLFxuICAgICAgZnVuY3Rpb24ocikgeyByZXR1cm4gci5mb3JtYXQgfSkpXG4gICAgICAuam9pbignICcpO1xuICAgIH07XG5cbiAgICAvLyBQYXNzIHRoZSBkYXRhc2V0IHJlc3VsdHMgdG8gdGhlIHRlbXBsYXRlXG4gICAgZm9yICh2YXIgaSBpbiBwYWNrYWdlcykge1xuICAgICAgdmFyIGRzbyA9IHBhY2thZ2VzW2ldO1xuICAgICAgdmFyIGRzID0ge1xuICAgICAgICB1cmw6ICAgICAgICAgICB1cmwgKyAnZW4vZGF0YXNldC8nICsgZHNvLm5hbWUsXG4gICAgICAgIHRpdGxlOiAgICAgICAgIGdldExhbmdEZWZhdWx0KGRzby5kaXNwbGF5X25hbWUpLFxuICAgICAgICBncm91cG5hbWU6ICAgICAoZHNvLmdyb3Vwcy5sZW5ndGggPT0gMCkgPyAnJyA6XG4gICAgICAgIGdldExhbmdEZWZhdWx0KGRzby5ncm91cHNbMF0uZGlzcGxheV9uYW1lKSxcbiAgICAgICAgZGVzY3JpcHRpb246ICAgZ2V0TGFuZ0RlZmF1bHQoZHNvLmRlc2NyaXB0aW9uKSxcbiAgICAgICAgZm9ybWF0czogICAgICAgZ2V0RGF0YXNldEZvcm1hdHMoZHNvLnJlc291cmNlcyksXG4gICAgICAgIG1vZGlmaWVkOiAgICAgIGRzby5tZXRhZGF0YV9tb2RpZmllZFxuICAgICAgfTtcbiAgICAgIGZyYWdtZW50cy5wdXNoKHRlbXBsYXRlKHsgZHM6IGRzIH0pKTtcbiAgICB9XG5cbiAgICBpZiAoZnJhZ21lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZnJhZ21lbnRzID0gWydObyByZXN1bHRzJ107XG4gICAgfVxuXG4gICAgLy8gSW5zZXJ0IGludG8gdGhlIGNvbnRhaW5lciBvbiB0aGUgcGFnZVxuICAgIGRpdi5odG1sKGZyYWdtZW50cy5qb2luKCcnKSk7XG5cbiAgfVxuXG4vLyBFbWJlZCBhIENLQU4gZGF0YXNldCByZXN1bHQgaW4gYSB3ZWIgcGFnZS5cbi8vIGVsOiBET00gZWxlbWVudCBpbiB3aGljaCB0byBwbGFjZSBjb21wb25lbnQgKERPTSBub2RlIG9yIENTUyBzZWxlY3Rvcilcbi8vIHVybDogU291cmNlIHBvcnRhbCAoVVJMIHN0cmluZylcbi8vIHF1ZXJ5OiBQYXJhbWV0ZXJzIGZvciBDS0FOIEFQSSAob2JqZWN0KSBvciBzZWFyY2ggcXVlcnkgKHN0cmluZylcbi8vIGNhbGxiYWNrOiBpbnZva2VkIHdpdGggdGhlIGxvYWRlZCBDS0FOIGNsaWVudFxuZnVuY3Rpb24gZGF0YXNldHMoZWwsIHVybCwgcXVlcnksIGNhbGxiYWNrKSB7XG4gIHZhciBjYiA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCl7fSxcbiAgICAgIGNsaWVudCwgY29uZmlnLCBwYWNrYWdlcywganNvbnA7XG5cbiAgdHJ5IHtcbiAgICAvLyBQYXJzZSBDS0FOIHF1ZXJ5XG4gICAgaWYgKF8uaXNTdHJpbmcocXVlcnkpKSB7XG4gICAgICBjb25maWcgPSB7IHE6IHF1ZXJ5IH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZyA9IHF1ZXJ5O1xuICAgIH1cbiAgICBpZiAoXy5pc1VuZGVmaW5lZChjb25maWcuc29ydCkpIHtcbiAgICAgIGNvbmZpZy5zb3J0ID0gJ21ldGFkYXRhX21vZGlmaWVkIGRlc2MnO1xuICAgIH1cbiAgICBpZiAoXy5pc1VuZGVmaW5lZChjb25maWcuanNvbnApKSB7XG4gICAgICBqc29ucCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGpzb25wID0gY29uZmlnLmpzb25wO1xuICAgICAgZGVsZXRlIGNvbmZpZy5qc29ucDtcbiAgICB9XG5cbiAgICAvLyBlbnN1cmUgY29udGFpbmVyIGRpdiBoYXMgY2xhc3NcbiAgICB2YXIgZGl2ID0gJChlbClcbiAgICAgIC5hZGRDbGFzcygnY2thbi1lbWJlZCcpXG4gICAgICAuaHRtbCgnJyk7IC8vIGNsZWFyIGNvbnRhaW5lclxuXG4gICAgLy8gY3JlYXRlIGEgY2xpZW50XG4gICAgdmFyIGNsaWVudCA9IG5ldyBDS0FOLkNsaWVudCh1cmwpO1xuICAgIHZhciBhY3Rpb24gPSAncGFja2FnZV9zZWFyY2gnO1xuXG4gICAgLy8gZXh0ZW5kIGNrYW4uanMgYWN0aW9uIHJvdXRpbmUgd2l0aCBqc29ucCBzdXBwb3J0XG4gICAgaWYgKGpzb25wKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgdXJsOiBjbGllbnQuZW5kcG9pbnQgKyAnLzMvYWN0aW9uLycgKyBhY3Rpb24sXG4gICAgICAgIGRhdGE6IGNvbmZpZywgZGF0YVR5cGU6IFwianNvbnBcIixcbiAgICAgICAgdHlwZTogJ1BPU1QnLCBjYWNoZTogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgJC5hamF4KG9wdGlvbnMpXG4gICAgICAuZmFpbChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgaWYgKGVyciAhPSBudWxsKSB7IGNiKGVycik7IHJldHVybjsgfVxuICAgICAgfSlcbiAgICAgIC5kb25lKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICBwYWNrYWdlcyA9IHJlcy5yZXN1bHQucmVzdWx0cztcbiAgICAgICAgZ2VuZXJhdGVWaWV3KGRpdiwgdXJsLCBwYWNrYWdlcyk7XG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByZWNvbW1lbmRlZCBkZWZhdWx0IHVzYWdlIG9mIGNrYW4uanMsIGUuZy4gdGhyb3VnaCBDT1JTIG9yIHByb3h5XG4gICAgICBjbGllbnQuYWN0aW9uKGFjdGlvbiwgY29uZmlnLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyICE9IG51bGwpIHsgY2IoZXJyKTsgcmV0dXJuOyB9XG4gICAgICAgIHBhY2thZ2VzID0gcmVzLnJlc3VsdC5yZXN1bHRzO1xuICAgICAgICBnZW5lcmF0ZVZpZXcoZGl2LCB1cmwsIHBhY2thZ2VzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICBjYihudWxsLCB7Y2xpZW50OiBjbGllbnQsIGNvbmZpZzogY29uZmlnLCBwYWNrYWdlczogcGFja2FnZXN9KTtcbiAgfSBjYXRjaCAoZXJyKSB7IGNiKGVycik7IH1cblxufVxuXG4vLyBtYWtlIGNvbmZpZyBleHRlcm5hbGx5IHZpc2libGVcbmRhdGFzZXRzLmNvbmZpZyA9IGNvbmZpZztcblxubW9kdWxlLmV4cG9ydHMgPSBkYXRhc2V0cztcbiJdfQ==
