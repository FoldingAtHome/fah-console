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


module.exports = {
  template: '<canvas class="chart"></canvas>',
  props: ['series'],


  watch: {
    series: function () {this.load()}
  },


  mounted: function () {this.load()},


  methods: {
    load: function () {
      var datasets = [];
      var yAxes = [];

      for (var i = 0; i < this.series.length; i++) {
        var s = this.series[i];

        yAxes.push({
          id: '_' + i,
          position: s.position,
          gridLines: {display: true, color: '#445c61'},
          scaleLabel: {
            display: true,
            labelString: s.label,
            fontColor: s.color
          },
          ticks: {fontColor: s.color, callback: util.human_number}
        });

        datasets.push({
          label: s.label,
          yAxisID: '_' + i,
          borderColor: s.color,
          lineTension: 0,
          data: s.data
        });
      }

      new Chart(this.$el.getContext('2d'), {
        type: 'line',
        data: {datasets: datasets},
        options: {
          stacked: false,
          responsive: true,
          legend: {display: false},
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label;
                return label + ': ' + util.human_number(tooltipItem.yLabel);
              }
            }
          },

          scales: {
            xAxes: [{
              type: 'time',
              time: {unit: 'day'},
              gridLines: {display: true, color: '#445c61'}
            }],
            yAxes: yAxes
          }
        }
      })
    }
  }
}
