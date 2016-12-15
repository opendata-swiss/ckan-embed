# ckan-embed

This module supports embedding information dynamically from CKAN data portals into other websites. Currently only dataset (package) search results are supported.

## Basic usage

After adding [jQuery](https://www.npmjs.com/package/jquery), [LoDash](https://www.npmjs.com/package/lodash) and [ckan](https://www.npmjs.com/package/ckan) scripts to the page:

```html
<script src="https://raw.githubusercontent.com/Datalets/ckan-embed/master/dist/ckan-embed.min.js"></script>
...
<div class="opendata-swiss" id="example-1"></div>
...
<script>
ck.datasets('#example-1', 'https://opendata.swiss/', 'RDF');
</script>
```

For more usage examples see `test/index.html`.

## Developer notes

For information on the JavaScript CKAN client see [ckan.js](https://github.com/okfn/ckan.js), for details of API usage see [docs.ckan.org](http://docs.ckan.org/en/latest/api/) for [package_search](http://docs.ckan.org/en/latest/api/index.html?highlight=organization_list#ckan.logic.action.get.package_search).

A web server like [NGINX can be used](https://www.nginx.com/resources/admin-guide/reverse-proxy/) to proxy requests and avoid the use of JSONP.

## Build Process

To build `ckan-embed.js` and view the test examples, you must have [npm](https://www.npmjs.com/) installed.

1. Run `npm install` in the ckan-embed folder to install dependencies.
2. Run `npm run build`. This will invoke [browserify](http://browserify.org/) to bundle the source files, and then [uglify-js](http://lisperator.net/uglifyjs/) to create the minified version.
3. Run a local webserver (e.g., `python -m SimpleHTTPServer 8000`) in the root folder and then point your web browser at the test directory (e.g., `http://localhost:8000/test/`).

## Acknowledgments

This project was inspired by and initially based on [vega-embed](https://github.com/vega/vega-embed).

Developed with support from the [Swiss Federal Archives](https://www.bar.admin.ch).
