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

var login   = require('./login');
var api     = require('./api');


module.exports = {
  router: require('./router'),


  data: function ()  {
    return {
      loading: true,
      logged_in: false,
      account: undefined,
      clients: ['127.0.0.1:7397']
    }
  },


  components: {
    'fah-client': require('./fah-client')
  },


  computed: {
    route: function () {
      var parts = this.$route.path.split('/');
      var s = '';

      for (var i = 1; i < parts.length && !/^\d*$/.test(parts[i]); i++) {
        if (!s.length) s = '-';
        s += ' ' + parts[i];
        break;
      }

      return s;
    }
  },


  mounted: function () {
    login.check(this._logged_in, this._logged_out);
  },


  methods: {
    _logged_in: function (info) {
      this.loading = false;
      this.info = info;
      this.logged_in = true;
      this.account_login();
    },


    _logged_out: function () {
      this.loading = false;
      this.logged_in = false;
      this.account = {};
    },


    login: function () {login.login()},


    logout: function () {
      login.logout().done(function () {
        this.account = {}
        this.logged_in = false;
        this.$router.push('/');
      }.bind(this))
    },


    not_found: function() {
      this.account = {
        avatar: this.info.avatar,
        name: this.info.name,
        team: 0,
        passkey: ''
      }

      if (this.$route.path != '/account/register')
        this.$router.push('/account/register');
    },


    account_login: function () {
      api.get('/account', 'Account login', {statusCode: {404: this.not_found}})
        .done(function (data) {this.account = data}.bind(this))
    }
  }
}
