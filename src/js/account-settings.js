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
  template: '#account-settings-template',
  props: ['account'],


  data: function () {
    return {
      show_token: false
    }
  },


  computed: {
    token: function () {
      if (this.show_token) return this.account.token;
      return '*'.repeat(this.account.token.length);
    }
  },


  methods: {
    copy_token: function () {
      util.copy_to_clipboard(this.account.token);
    }
  }
}
