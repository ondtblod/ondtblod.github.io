var Rickshaw = require('rickshaw');
var moment = require('moment');

module.exports = function(opts) {
  'use strict';
  var id = opts.id;
  var width = opts.width;
  var height = opts.height;
  var data = opts.data;
  var graph = new Rickshaw.Graph({
    element: document.getElementById('chart-' + id),
    width: width,
    height: height,
    renderer: 'line',
    series: [
      {
        data: data,
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

      }, this);
    }
  });
  graph.render();

  var hover = new Hover( { graph: graph } );

  var axes = new Rickshaw.Graph.Axis.Time({
    graph: graph
  });
  axes.render();
  var preview = new Rickshaw.Graph.RangeSlider({
    graph: graph,
    element: document.getElementById('preview-' + id)
  });
  return {
    graph: graph,
    preview: preview,
    axes: axes,
    hover: hover
  };
};
