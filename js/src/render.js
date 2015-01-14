'use strict';
var Tabletop = require('Tabletop');
var graph = require('./graph');
var moment = require('moment');
var $ = require('jQuery');
var document;

var init = function(data, id, name) {
  var width = document.getElementById('chartwrapper-' + id).offsetWidth;
  var height = Math.min(width / 2, 300);
  // Always set all tabs to that height.
  $('#chartwrapper-' + id + ' .tab').css('height', height);
  // Remove the loader.
  document.getElementById('loading-' + id).style.display = 'none';
  var graphed = false;
  var d = [];
  var highestX = 0;
  var lastY = 0;
  var lastX = 0;

  for (var i = 0, len = data.length; i < len; i++) {
    var row = data[i];
    if (i % 10 !== 0) {
      continue;
    }
    d.push({
      x: parseInt(row.time, 10) / 1000,
      y: parseFloat(row.value, 10)
    });
    lastX = parseFloat(row.value, 10);
    lastY = parseInt(row.time, 10) / 1000;
    if (parseFloat(row.value, 10) > highestX) {
      highestX = parseFloat(row.value, 10);
    }
  }

  // Set some initial text.
  document.querySelector('#chartwrapper-' + id + ' .tab1')
  .innerHTML += 'Highest value: ' + highestX + '<br>';
  document.querySelector('#chartwrapper-' + id + ' .tab1')
  .innerHTML += 'Current value: ' + lastX + '<br>';
  var lastTime = moment(lastY * 1000).format('D. MMM YYYY H:mm:ss');
  document.querySelector('#chartwrapper-' + id + ' .tab1')
  .innerHTML += 'Last updated: ' + lastTime + '<br>';

  // Attach listener for toggling graph.
  $('#chartwrapper-' + id + ' .nav a').click(function() {
    $('#chartwrapper-' + id + ' .nav li')
    .removeClass('active');
    $('#chartwrapper-' + id + ' .tab')
    .hide();
    $(this).closest('li')
    .addClass('active');
    var tab = $(this).data('toggle');
    $('#chartwrapper-' + id + ' .' + tab).show();
    if (!graphed) {
      graphIt();
    }
  });


  var graphIt = function() {
    graphed = true;
    graph({
      id: id,
      width: width,
      height: height,
      data: d
    });
  };

};

function getDataAndRender(winDoc, id, doc) {
  document = winDoc;
  if (!doc.json) {
    Tabletop.init({
      key: doc.doc,
      callback: function(d) {
        init(d, id, doc.name);
      },
      simpleSheet: true
    });
  }
  else {
    $.ajax({
      url: '/json/' + doc.doc + '.json',
      success: function(d) {
        init(d, id, doc.name);
      }
    });
  }
  var wrapEl = document.createElement('div');
  wrapEl.className = 'chart-wrapper col-xs-12 col-md-4 col';
  wrapEl.innerHTML += '<div id="chartwrapper-' + id + '" class="inner"><ul class="nav nav-tabs"><li class="active"><a href="#" data-toggle="tab1">Info</a></li><li class=""><a href="#" data-toggle="tab2">Graph</a></li></ul><h3 class="graph-title">' + doc.name + '</h3></div>';
  document.getElementById('main').appendChild(wrapEl);

  var newEl = document.getElementById('chartwrapper-' + id);

  var firstTab = document.createElement('div');
  firstTab.className = 'tab tab1';
  newEl.appendChild(firstTab);

  var secondTab = document.createElement('div');
  secondTab.className = 'tab tab2';
  secondTab.innerHTML = '<div id="chart-' + id + '"></div><div id="preview-' + id + '"></div><div class="legend-container panel panel-info" id="legend-' + id + '"></div>';
  secondTab.style.display = 'none';
  newEl.appendChild(secondTab);

  var loading = document.createElement('div');
  loading.id = 'loading-' + id;
  loading.className = 'loading';
  loading.innerHTML = '<img src="/css/img/puff.svg">';
  firstTab.appendChild(loading);
  wrapEl.appendChild(newEl);

}
module.exports = getDataAndRender;
