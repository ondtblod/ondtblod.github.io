var Rickshaw = require('rickshaw');
var Tabletop = require('Tabletop');
var document;

var init = function(data, id, name) {
  var el = document.getElementById('main');
  var width = el.offsetWidth;
  var newEl = document.createElement('div');
  newEl.id = 'chartwrapper-' + id;
  newEl.innerHTML = '<div id="chart-' + id + '"></div><div class="legend-container"><div id="legend-' + id + '"></div></div>';
  el.appendChild(newEl);
  var d = [];
  for (var i = 0, len = data.length; i < len; i++) {
    var row = data[i];
    d.push({
      x: 3600 + parseInt(row.time, 10) / 1000,
      y: parseInt(row.value, 10)
    });
  }
  var graph = new Rickshaw.Graph({
    element: document.getElementById("chart-" + id),
    width: width,
    height: Math.min(width / 1.5, 300),
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

      legendEl.innerHTML = args.formattedXValue;

      args.detail.sort(function(a, b) { return a.order - b.order }).forEach( function(d) {

        var line = document.createElement('div');
        line.className = 'line';

        var swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = d.series.color;

        var label = document.createElement('div');
        label.className = 'label';
        label.innerHTML = d.name + ": " + d.formattedYValue;

        line.appendChild(swatch);
        line.appendChild(label);

        legendEl.appendChild(line);

        var dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.top = graph.y(d.value.y0 + d.value.y) + 'px';
        dot.style.borderColor = d.series.color;

        this.element.appendChild(dot);

        dot.className = 'dot active';

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
  document.getElementById('loading').className += ' done';

}

function getDataAndRender(winDoc, id, doc) { 
  document = winDoc;
  Tabletop.init({
    key: doc.doc,
    callback: function(d) {
      init(d, id, doc.name)
    },
    simpleSheet: true
  });
}
module.exports = getDataAndRender;
