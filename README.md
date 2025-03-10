# ckan-embed

This is a widget for embedding live data searches from CKAN data portals into external websites. Currently only dataset (package) search results are supported, but the module can easily support any calls through the [ckan-js](https://www.npmjs.com/package/ckan) library. For some background on this project, visit the [Swiss OGD Handbook](https://handbook.opendata.swiss/de/content/glossar/bibliothek/embed.html).

**Nota Bene:** this project is not very actively maintained, and includes a deprecated dependency. See [Issue #45](https://github.com/opendata-swiss/ckan-embed/issues/45) for alternative options.

**Demo:** [example pages](https://opendata-swiss.github.io/ckan-embed/examples/)

## Usage notes

This script can be used with any [CKAN](http://ckan.org) portal. It exposes a `CKANembed` module with several functions. The first parameter is the DOM container into which the widget should be loaded, the second parameter a fully qualified URL to the target CKAN portal, and the third can be a free text search query (for example, "statistik").

Project dependencies include [jQuery](https://www.npmjs.com/package/jquery), [Underscore](https://www.npmjs.com/package/underscore), [ckan](https://www.npmjs.com/package/ckan).

# Installation

(1) Add the *ckan-embed* script into the page:

```html
<script src="https://cdn.jsdelivr.net/gh/opendata-swiss/ckan-embed/dist/ckan-embed.bundle.js"></script>
```

This includes non-blocking versions of dependency scripts. It is a relatively large (~500 KB download - see [issue #14](https://github.com/opendata-swiss/ckan-embed/issues/14)), so if you are loading the project dependencies listed above in your web page already, use the minified version `ckan-embed.min.js` (~40 KB) instead.

(2) Place the container somewhere on the page:

```html
<div id="example-1">
	Loading '<a href="https://opendata.swiss">statistik</a>' datasets ...
</div>
```

(3) Add the init code - this will work if your script is in the header:

```html
...
<script>
CKANembed.search('#example-1', 'https://opendata.swiss/', 'statistik');
</script>
```

The widget will then render in the `#example-1` container. Some styling possibilities, such as showing the logo of the portal, are explored in `test/style.css`.

We recommend placing the script in the foot of the page and running this command in an `onload` routine for better performance, e.g.:

```js
$(document).ready(function() {
  CKANembed.search('#example-1', 'https://opendata.swiss/', 'statistik');
});
```

### Upgrading

We have changed from `datasets` to `search` for the call that returns multiple results, to avoid confusion with the singular `dataset` method. The old function name will continue to work.

If you used previous versions of the script, mind the fact that we've changed the global from `ck` to `CKANembed`:

```html
<script>
var ck = CKANembed; // backwards compatibility
ck.search('#example-1', 'https://opendata.swiss/', 'statistik');
</script>
```

### Advanced options

The script may also be initialized with a configuration object, for example in this case to show three datasets tagged 'hospitals', without using JSONP* and instead proxying the requests through to the API at the `/ckanproxy/` path:

```
CKANembed.search('#example-2', 'https://opendata.swiss/', {
	fq:       'tags:hospitals',
	rows:     3,
	lang:     'de',
	jsonp:    false,
	proxy:    '/ckanproxy/'
}
```

- `fq`: allows use of [filter queries](http://docs.ckan.org/en/latest/api/index.html?highlight=filter%20queries)
- `rows`: limit the number of results shown
- `sort`: custom sorting order (see note below)
- `lang`: default language for result links
- `jsonp`: toggle the use of JSONP (see note below)
- `proxy`: relative or absolute path to API proxy
- `template`: an HTML template for the results (see [example](examples/template.html))

## Usage notes

If you are running this script on the same server or using a backend proxy (supported in all web servers) to the CKAN API, it is recommended that you *disable* **JSONP** with the `jsonp: false` option. We have made it to be enabled by default since many CKAN servers can still only be reached through this method.

The default sorting order is `name asc` (alphabetical name ascending). Besides `name`, `package_count` and `title` are allowed. On multilingual CKAN servers add language suffix e.g. `title_string_en`. For specifying ascending or descending order append `asc` or `desc`.

For more usage examples see the `examples` folder.

## Developer notes

For information on the JavaScript CKAN client see [ckan.js](https://github.com/okfn/ckan.js), for details of API usage see [docs.ckan.org](http://docs.ckan.org/en/latest/api/) for [package_search](http://docs.ckan.org/en/latest/api/index.html?highlight=organization_list#ckan.logic.action.get.package_search).

A web server like [NGINX can be used](https://www.nginx.com/resources/admin-guide/reverse-proxy/) to proxy requests and avoid the use of JSONP.

## Build Process

To build `ckan-embed.js` and view the test examples, you must have [yarn](https://yarnpkg.com/) installed.

1. Run `yarn` in the ckan-embed folder to install dependencies.
1. With `yarn dev` and `yarn watch` the code will be compiled.
1. Start a local webserver with `yarn dev` then open http://localhost:8000/examples/
1. Run `yarn run build`* for a production release.
1. Run `yarn run deploy` to do tests and update the distributables.

(* this will invoke [browserify](http://browserify.org/) to bundle the source files, and then [uglify-js](http://lisperator.net/uglifyjs/) to create the minified version).

## Acknowledgments

Developed with support from the [Swiss Federal Archives](https://www.bar.admin.ch).

This project was initially based on [vega-embed](https://github.com/vega/vega-embed).
