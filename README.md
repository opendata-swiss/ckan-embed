# ckan-embed

This module supports embedding information dynamically from CKAN data portals into other websites. Currently only dataset (package) search results are supported. For background on this project visit the [Swiss OGD Handbook](http://handbook.opendata.swiss/en/library/embed.html).

## Basic usage

After adding [jQuery](https://www.npmjs.com/package/jquery), [LoDash](https://www.npmjs.com/package/lodash) and [ckan](https://www.npmjs.com/package/ckan) scripts to the page:

```html
<script src="https://raw.githubusercontent.com/opendata-swiss/ckan-embed/master/dist/ckan-embed.min.js"></script>
...
<div class="opendata-swiss" id="example-1"></div>
...
<script>
ck.datasets('#example-1', 'https://opendata.swiss/', 'RDF');
</script>
```

With the second parameter a fully qualified URL to the target CKAN portal, and the third ("RDF") a free text search query. The script may also be initialized with a configuration object:

```js
ck.datasets('#example-2', 'https://opendata.swiss/', {
	fq:       'tags:hospitals',
	rows:     3,
	jsonp:    true
}
```

- `fq`: allows use of [filter queries](http://docs.ckan.org/en/latest/api/index.html?highlight=filter%20queries)
- `rows`: limit the number of results shown
- `jsonp`: toggle the use of JSONP (see note below)

If you are running this script on the same server or using a backend proxy (supported in all web servers) to the CKAN API, we recommend that you *disable* JSONP with the `jsonp: false` option.

For more usage examples see `test/index.html`.

## Developer notes

For information on the JavaScript CKAN client see [ckan.js](https://github.com/okfn/ckan.js), for details of API usage see [docs.ckan.org](http://docs.ckan.org/en/latest/api/) for [package_search](http://docs.ckan.org/en/latest/api/index.html?highlight=organization_list#ckan.logic.action.get.package_search).

A web server like [NGINX can be used](https://www.nginx.com/resources/admin-guide/reverse-proxy/) to proxy requests and avoid the use of JSONP.

## Build Process

To build `ckan-embed.js` and view the test examples, you must have [npm](https://www.npmjs.com/) installed.

1. Run `npm install` in the ckan-embed folder to install dependencies.
2. Run `npm run build` (this will invoke [browserify](http://browserify.org/) to bundle the source files, and then [uglify-js](http://lisperator.net/uglifyjs/) to create the minified version).
3. Run `bower install` to fetch local versions of the `lodash` and `jquery` libraries for the test instance.
4. Run a local webserver (e.g., `python -m SimpleHTTPServer 8000`) in the root folder and then point your web browser at the test directory (e.g., `http://localhost:8000/test/`).

## Acknowledgments

This project was inspired by and initially based on [vega-embed](https://github.com/vega/vega-embed).

Developed with support from the [Swiss Federal Archives](https://www.bar.admin.ch).
