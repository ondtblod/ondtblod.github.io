var getDataAndRender = require('./src/render.js');

document.addEventListener('DOMContentLoaded', function() {
  if (typeof(sheets) === 'undefined') {
    return;
  }
  for (var i in sheets) {
    if (sheets.hasOwnProperty(i)) {
      getDataAndRender(document, i, sheets[i]);
    }
  }
  var el = document.createElement('h1');
  el.className = 'title';
  el.innerHTML = name;
  document.getElementById('main').appendChild(el);
});
window.$ = require('jQuery');
var s = require('simple-jekyll-search/src');
SimpleJekyllSearch.init({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('autocomplete-results'),
  dataSource: '/search.json'
});
require('./vendor/bootstrap/collapse');
