require('should');
var g = require('../js/src/graph');

describe('Graph module', function() {
  it('Should export a function', function() {
    g.should.be.instanceOf(Function);
  });
});
