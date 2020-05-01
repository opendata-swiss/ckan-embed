'use strict';

var fs = require('fs');
var assert = require('chai').assert;
var embed = require('../src/embed');

function error_msg(desc, e) {
  return desc + ': ' + JSON.stringify(e, function(key, value) {
    return key === 'stack' ? undefined : value;
  }, 2);
}

describe('embed', function() {

  it('should truncate long strings', function() {
    assert.ok("AB..." === embed.truncate("ABC", 2),
      error_msg('Not truncating correctly', {}));
  });

  it('should return null from an empty view', function() {
    assert.ok(null === embed.generateView('', [], {}));
  });

  it('should return null for no request', function() {
    assert.ok(null === embed.parametrize({}));
  });

  it('should parametrize request defaults', function() {
    var P;
    P = embed.parametrize('test');
    assert.ok('test' === P.request.q);
    // Test default options
    assert.ok(5 === P.request.rows);
    assert.ok(P.request.sort.indexOf('desc')>0);
    assert.ok(true === P.options.jsonp);
    assert.ok(null === P.options.proxy);
    assert.ok(null === P.options.lang);
  });

  it('should parametrize other request forms', function() {
    var P;
    P = embed.parametrize({ q: 'test' });
    assert.ok('test' === P.request.q);
    P = embed.parametrize({ fq: 'test' });
    assert.ok('test' === P.request.fq);
    assert.ok(typeof(P.request.q) === 'undefined');
  });

});
