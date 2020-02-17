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

var util = require('./util');
var api = require('./api');


module.exports = {
  template: '#top-table-template',
  props: ['series', 'period', 'count', 'sort'],


  data: function () {
    return {
      query: '',
      data: undefined
    }
  },


  watch: {
    series: function () {this.reload()},
    period: function () {this.reload()},
    count:  function () {this.reload()},
    sort:   function () {this.reload()}
  },


  mounted: function () {this.reload()},


  methods: {
    reload: function () {
      var data = {
        count: this.count,
        sort: this.sort,
        descending: this.sort == 'delta' ? 0 : 1
      }

      var query = this.series + this.period + JSON.stringify(data);
      if (this.query == query) return;
      this.query = query;
      this.data = undefined;

      api.get('/top/' + this.series + '/' + this.period,
              'Top ' + this.series + ' ' + this.period + ' lookup',
              {data: data})

        .done(function (data) {
          if (query == this.query) this.data = data;
        }.bind(this))
    },


    link: function(row) {
      if (this.series == 'team' || this.series == 'account')
        this.$router.push('/' + this.series + '/' + row.id);
    },


    errored_title: function (row) {
      return 'Failed: ' + row.failed.toLocaleString() + ' Faulty: ' +
        row.faulty.toLocaleString() + ' Dumped: ' + row.dumped.toLocaleString();
    }
  }
}
