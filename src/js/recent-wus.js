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
  template: '#recent-wus-template',
  props: ['path', 'count'],


  data: function ()  {
    return {
      wus: undefined
    }
  },


  mounted: function () {this.load()},


  methods: {
    set: function (wus) {this.wus = wus},


    load: function () {
      this.wus = undefined;

      api.get(this.path, 'Recent WUs lookup', {
        data: {count: this.count},
        statusCode: {404: this.not_found}
      }).done(this.set);
    },


    not_found: function() {
      message.error('Not found', 'Recent WUs not found');
    },


    status_icon: util.status_icon,
    wu_prcg: util.wu_pcrg
  }
}
