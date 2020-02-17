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
  template: '#account-settings-template',


  data: function () {
    return {
      register: false,
      show_passkey: false,
      show_token: false,
      avatar: '',
      name: '',
      team: 0,
      passkey: ''
    }
  },


  mounted: function () {
    this.register = this.$route.path == '/account/register';
    this.avatar   = this.account.avatar;
    this.name     = this.account.name;
    this.team     = this.account.team;
    this.passkey  = this.account.passkey || '';
  },


  computed: {
    account: function () {return this.$root.account},


    valid: function () {
      return /^([A-Fa-f0-9]{30,32}|)$/.test(this.passkey) &&
        1 < this.name.length && this.name.length < 101 &&
        /^\d+$/.test(this.team);
    }
  },


  methods: {
    copy_token: function () {util.copy_to_clipboard(this.account.token)},


    save: function () {
      // TODO validate args

      var data = {
        name:    this.name,
        avatar:  this.avatar,
        team:    this.team,
        passkey: this.passkey || undefined
      }

      api.put('/account', 'Saving account settings', data)
        .done(function () {
          for (var name in data) this.account[name] = data[name];
          this.$router.push('/');
        }.bind(this));
    },


    cancel: function () {
      if (this.register) this.$root.logout();
      else this.$router.push('/');
    }
  }
}
