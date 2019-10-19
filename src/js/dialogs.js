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


module.exports = {
  data: function () {return {show: {}}},


  methods: {
    open_dialog: function (name) {
      this.$set(this.show, name, true);

      if (typeof this.overlay != 'undefined') return;
      var close = function() {this.close_dialog(name)}.bind(this);
      this.overlay = util.overlay_create(this.$el.parentNode, close);
    },


    close_dialog: function (name) {
      if (typeof name == 'undefined') this.show = {};
      else this.$set(this.show, name, false);

      if (typeof this.overlay != 'undefined') {
        this.overlay.close_overlay();
        this.overlay = undefined;
      }
    }
  }
}
