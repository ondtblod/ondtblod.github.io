var getDataAndRender = require('./src/render.js');


document.addEventListener('DOMContentLoaded', function() {
  if (typeof(sheets) === 'undefined') {
    return;
  }
  for (var i in sheets) {
    getDataAndRender(document, i, sheets[i]);
  }
  var el = document.createElement('h1');
  el.className = 'title';
  el.innerHTML = name;
  document.getElementById('main').appendChild(el);
});
