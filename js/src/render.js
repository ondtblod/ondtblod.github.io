var Rickshaw = require('rickshaw');
var Tabletop = require('Tabletop');
var moment = require('moment');
var $ = require('jquery');
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
    console.log(tab );
    $('#chartwrapper-' + id + ' .' + tab).show();
    if (!graphed) {
      graph();
    }
  });


  var graph = function() {
    graphed = true;
    var graph = new Rickshaw.Graph({
      element: document.getElementById('chart-' + id),
      width: width,
      height: height,
      renderer: 'line',
      series: [
        {
          data: d,
          color: "#c05020",
          name: name
        }
      ]
    });
    var legendEl = document.querySelector('#legend-' + id);

    var Hover = Rickshaw.Class.create(Rickshaw.Graph.HoverDetail, {

      render: function(args) {
        var m = moment(args.domainX * 1000);
        var d = m.format('D. MMM YYYY H:mm:ss');

        legendEl.innerHTML = '<div class="panel-heading"><h3 class="panel-title">' + d + '</h3></div>';

        args.detail.sort(function(a, b) { return a.order - b.order; }).forEach( function(d) {

          var line = document.createElement('div');
          line.className = 'line';

          var swatch = document.createElement('div');
          swatch.className = 'swatch';
          swatch.style.backgroundColor = d.series.color;

          var label = document.createElement('div');
          label.className = 'legend-label panel-body';
          label.innerHTML = d.formattedYValue;

          line.appendChild(swatch);
          line.appendChild(label);

          legendEl.appendChild(line);

          var dot = document.createElement('div');
          dot.className = 'dot';
          dot.style.top = graph.y(d.value.y0 + d.value.y) + 'px';
          dot.style.borderColor = d.series.color;

          this.element.appendChild(dot);

          dot.className = 'dot active';

          legendEl.style.top = (graph.y(d.value.y0 + d.value.y) > (height / 3)  ? 0 : height) + 'px';
          if (parseInt(this.element.style.left, 10) > (width - (width / 4))) {
            legendEl.style.right = 0;
            legendEl.style.removeProperty('left');
          }
          else {
            legendEl.style.left = this.element.style.left;
            legendEl.style.removeProperty('right');
          }

          this.show();

        }, this );
      }
    });

    var hover = new Hover( { graph: graph } );

    var axes = new Rickshaw.Graph.Axis.Time({
      graph: graph
    });
    axes.render();

    graph.render();
  };

};

function getDataAndRender(winDoc, id, doc) {
  document = winDoc;
  Tabletop.init({
    key: doc.doc,
    callback: function(d) {
      init(d, id, doc.name);
    },
    simpleSheet: true
  });
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
  secondTab.innerHTML = '<div id="chart-' + id + '"></div><div class="legend-container panel panel-info" id="legend-' + id + '"></div>';
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
