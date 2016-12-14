'use strict';

var fs = require('fs');
var assert = require('chai').assert;

function error_msg(desc, e) {
  return desc + ': ' + JSON.stringify(e, function(key, value) {
    return key === 'stack' ? undefined : value;
  }, 2);
}


describe('embed', function() {

  it('should write some tests', function() {
    assert.ok(false, error_msg('No Tests', {}));
  });


});
