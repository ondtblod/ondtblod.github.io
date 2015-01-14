var Tabletop = require('tabletop');
var fs = require('fs');
var util = require('util');

var doc = process.argv[2];
if (!doc) {
  console.error('Please supply a doc to transfer');
}
else {
  Tabletop.init({
    key: doc,
    simpleSheet: true,
    callback: function(data) {
      fs.writeFile('./json/' + doc + '.json', JSON.stringify(data), 'utf8', function(e, d) {
        if (e) {
          throw(e);
        }
        console.log(util.format('Doc %s was transferred sucessfully', doc));
      });
    }
});

}
