The [ckan-embed](http://github.com/datalets/ckan-embed) module supports embedding information dynamically from CKAN data portals into other websites.

## Build Process

To build `ckan-embed.js` and view the test examples, you must have [npm](https://www.npmjs.com/) installed.

1. Run `npm install` in the ckan-embed folder to install dependencies.
2. Run `npm run build`. This will invoke [browserify](http://browserify.org/) to bundle the source files, and then [uglify-js](http://lisperator.net/uglifyjs/) to create the minified version.
3. Run a local webserver (e.g., `python -m SimpleHTTPServer 8000`) in the root folder and then point your web browser at the test directory (e.g., `http://localhost:8000/test/`).

## Usage notes

For information on the JavaScript CKAN client see [ckan.js](https://github.com/okfn/ckan.js), for details of API usage see [docs.ckan.org](http://docs.ckan.org/en/latest/api/).

A web server like [NGINX can be used](https://www.nginx.com/resources/admin-guide/reverse-proxy/) to proxy requests and avoid the use of JSONP.
