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
  template: '<input class="number" :value="value" @input=input @change=change>',


  props: {
    value: {type: Number, required: true},
    min: {type: Number, default: 1},
    max: {type: Number}
  },


  data: function () {
    return {
      last: undefined,
      valid: true
    }
  },


  watch: {
    value: function (value) {
      this.valid = this.isValid(value)
      if (this.valid) this.last = parseInt(value);
    },


    valid: function () {
      if (this.valid) this.$el.classList.remove('invalid');
      else this.$el.classList.add('invalid');
    }
  },


  mounted: function () {
    this.valid = this.isValid(this.value);
    this.last = this.value;
  },


  methods: {
    isValid: function (value) {
      if (!/^[+-]?(0|([1-9]\d*))?(\.\d*)?$/.test(value)) return false;
      if (!/^[+-]?(0|([1-9]\d*))$/.test(value)) return false;

      value = parseInt(value);

      if (!isFinite(value)) return false;
      if (typeof this.min != 'undefined' && value < this.min) return false;
      if (typeof this.max != 'undefined' && this.max < value) return false;

      return true;
    },


    update: function ($event, set) {
      this.valid = this.isValid($event.target.value);

      if (set) {
        if (this.valid)
          this.$emit('input', this.last = parseInt($event.target.value));

        else {
          $event.target.value = this.last;
          this.valid = true;
        }
      }
    },


    input: function ($event) {this.update($event, false)},
    change: function ($event) {this.update($event, true)}
  }
}
