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


module.exports = {
  data: function () {
    return {show: {}}
  },


  methods: {
    close_overlay: function () {
      if (typeof this.overlay == 'undefined') return;
      this.overlay.remove();
      this.overlay = undefined;
    },


    create_overlay: function () {
      if (typeof this.overlay != 'undefined') return;

      this.overlay = $('<div>')
        .attr('class', 'overlay')
        .appendTo(this.$el.parentNode || document.body);
    },


    open_dialog: function (name) {
      this.$set(this.show, name, true);
      this.create_overlay();
    },


    close_dialog: function (name) {
      if (typeof name == 'undefined') this.show = {};
      else this.$set(this.show, name, false);
      this.close_overlay();
    }
  }
}
