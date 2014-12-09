var Rickshaw = require('rickshaw');
var Tabletop = require('Tabletop');

var init = function(data, id, name) {
  console.log(id);
  var el = document.getElementById('main');
  el.innerHTML = el.innerHTML + '<div id="chart-' + id + '"></div><div class="legend-container"><div id="legend-' + id + '"></div></div>';
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
    width: 1024,
    height: 300,
    renderer: 'line',
    series: [
      {
        data: d,
        color: "#c05020",
        name: name
      }
    ]
  });
  var hoverDetail = new Rickshaw.Graph.HoverDetail({
    graph: graph
  });

  var legend = new Rickshaw.Graph.Legend({
    graph: graph,
    element: document.getElementById('legend-' + id)
  });

  var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
    graph: graph,
    legend: legend
  });

  var axes = new Rickshaw.Graph.Axis.Time({
    graph: graph
  });
  axes.render();

  graph.render();

}

function getDataAndRender(id, doc) {
  
  Tabletop.init({
    key: doc.doc,
    callback: function(d) {
      console.log(d);
      init(d, id, doc.name)
    },
    simpleSheet: true
  });
}

document.addEventListener('DOMContentLoaded', function() {

  for (var i in docs) {
    getDataAndRender(i, docs[i]);
  }
});
