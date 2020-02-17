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

var api     = require('./api');
var message = require('./message');
var util    = require('./util');


module.exports = {
  template: '#recent-machines-template',
  props: ['path', 'count'],


  data: function ()  {
    return {
      machines: undefined
    }
  },


  mounted: function () {this.load()},


  methods: {
    set: function (machines) {this.machines = machines},


    load: function () {
      this.machines = undefined;

      api.get(this.path, 'Recent machines lookup', {
        statusCode: {404: this.not_found},
        data: {count: this.count}
      }).done(this.set);
    },


    not_found: function() {
      message.error('Not found', 'Recent machines not found');
    },


    os_icon: util.os_icon,


    get_type: function (m) {
      if (m.gpus) return m.gpu_vendor;
      return 'cpu:' + m.cpus;
    },


    is_active: function (time) {
      return new Date().getTime() -  Date.parse(time + 'Z') <
        50 * 24 * 60 * 60 * 1000;
    }
  }
}
