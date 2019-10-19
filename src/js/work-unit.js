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
  template: '#work-unit-template',
  props: ['unit'],
  mixins: [require('./dialogs.js')],


  computed: {
    assignment: function () {
      return (typeof this.unit.assignment == 'undefined') ?
        {} : this.unit.assignment;
    },


    wu: function () {
      return (typeof this.unit.wu == 'undefined') ? {} : this.unit.wu;
    },


    rcg: function () {
      if (typeof this.unit.wu == 'undefined') return '-';
      return '(' + this.wu.run + ', ' + this.wu.clone + ', ' + this.wu.gen + ')'
    }
  },


  methods: {
    get_state: function () {
      if (this.unit.paused) return 'Paused';
      return this.unit.state.toLowerCase();
    },


    is_paused: function() {return this.unit.paused},


    pause: function() {
      this.$emit('pause', !this.is_paused(), this.unit.id);
    },


    show_project: function () {
      this.$root.show_project(this.assignment.project, this.unit.topology,
                              this.unit.frames);
    }
  }
}
