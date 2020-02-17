/******************************************************************************\

                 This file is part of the Folding@home Client.

           The Folding@home Client runs protein folding simulations.
                   Copyright (c) 2001-2019, foldingathome.org
                              All rights reserved.

      This program is free software; you can redistribute it and/or modify
      it under the terms of the GNU General Public License as published by
       the Free Software Foundation; either version 2 of the License, or
                      (at your option) any later version.

        This program is distributed in the hope that it will be useful,
         but WITHOUT ANY WARRANTY; without even the implied warranty of
         MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                  GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
          51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

                 For information regarding this software email:
                                Joseph Coffland
                         joseph@cauldrondevelopment.com

\******************************************************************************/

'use strict'

/* globals Chart */

var util = require('./util');
var api = require('./api');

var colors = [
  '#00876c', '#519d73', '#80b27e', '#acc78d', '#d6dca2', '#fff1bb',
  '#f7d195', '#f1b076', '#ea8d60', '#e16854', '#d43d51'
]


module.exports = {
  template: '#line-chart-template',
  props: ['series', 'period', 'count', 'top', 'field', 'id', 'log'],


  data: function () {
    return {
      query: '',
      ts: {}
    }
  },


  watch: {
    series: function () {this.reload()},
    period: function () {this.reload()},
    count:  function () {this.reload()},
    top:    function () {this.reload()},
    field:  function () {this.reload()},
    log:    function () {this.reload()}
  },


  mounted: function () {this.reload()},


  methods: {
    link: function(row) {
      if (this.series == 'team' || this.series == 'account')
        this.$router.push('/' + this.series + '/' + row.id);
    },


    reload: function () {
      var data = {
        count: this.count,
        top: this.top,
        sort: this.field,
        descending: this.field == 'delta' ? 0 : 1,
        id: this.id
      }

      var query = this.series + this.period + JSON.stringify(data);
      if (this.query == query) return;
      this.query = query;

      api.get('/time-series/' + this.series + '/' + this.period,
              this.series + ' ' + this.period + ' lookup', {data: data})
        .done(function (ts) {
          if (query == this.query) this.load(ts);
        }.bind(this))

      if (typeof this.chart != 'undefined') {
        this.chart.destroy();
        this.chart = undefined;
      }
      this.ts = {}
    },


    load: function (ts) {
      ts.data = ts.data || []
      this.ts = ts;

      var datasets = [];
      var self = this;

      function get_data(data, id) {
        var d = [];

        for (var i = 0; i < data.length; i++)
          if (data[i].id == id)
            d.push({
              x: data[i].time + 'Z',
              y: data[i][self.field]
            });

        return d;
      }

      for (var i = 0; i < ts.meta.length; i++) {
        var meta = ts.meta[i];
        meta.color = colors[(i * 2) % colors.length];
        Vue.set(meta, 'enabled', true);

        var dataset = {
          label: meta.name,
          yAxisID: 1,
          borderColor: meta.color,
          borderJoinStyle: 'round',
          lineTension: 0,
          pointRadius: 0,
          pointHitRadius: 3,
          data: get_data(ts.data, meta.id)
        }

        meta.toggle = function(self, meta, dataset) {
          return function () {
            meta.enabled = !meta.enabled;
            dataset.hidden = !meta.enabled;
            self.chart.update();
          }
        }(self, meta, dataset);

        datasets.push(dataset);
      }

      this.chart = new Chart($(this.$el).find('canvas')[0].getContext('2d'), {
        type: 'line',
        data: {datasets: datasets},
        options: {
          stacked: false,
          responsive: true,
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label;
                return label + ': ' + util.human_number(tooltipItem.yLabel);
              }
            }
          },
          legend: {display: false},

          scales: {
            xAxes: [{
              type: 'time',
              time: {unit: 'day'},
              gridLines: {display: true, color: '#445c61'}
            }],

            yAxes: [{
              id: 1,
              type: this.log ? 'logarithmic' : 'linear',
              position: 'left',
              gridLines: {display: true, color: '#445c61'},
              ticks: {fontColor: '#62858c', callback: function (value) {
                return util.human_number(value, 0);
              }}
            }]
          }
        }
      })
    }
  }
}
