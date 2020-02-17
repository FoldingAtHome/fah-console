/******************************************************************************\

                    Copyright 2018. Cauldron Development LLC
                              All Rights Reserved.

                  For information regarding this software email:
                                 Joseph Coffland
                          joseph@cauldrondevelopment.com

        This software is free software: you can redistribute it and/or
        modify it under the terms of the GNU Lesser General Public License
        as published by the Free Software Foundation, either version 2.1 of
        the License, or (at your option) any later version.

        This software is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
        Lesser General Public License for more details.

        You should have received a copy of the GNU Lesser General Public
        License along with the C! library.  If not, see
        <http://www.gnu.org/licenses/>.

\******************************************************************************/

'use strict'

var util = require('./util')
var api  = require('./api')


function get_redirect() {return location.href.replace(/[#?].*$/, '')}


module.exports = {
  login: function () {
    return api.get('/login/google', 'Login',
                   {data: {redirect_uri: get_redirect()}})
      .done(function (data) {
        util.cookie_set('sid', data.id);
        location.href = data.redirect
      })
  },


  check: function (in_cb, out_cb) {
    // Attempt login if 'state' was passed
    if (util.query_get('state'))
      return api.get('/login/google' + location.search, 'Login redirect',
                     {xhrFields: {withCredentials: true}})
        .always(function () {location.search = ''}) // Clear login args

    // Check if we are already logged in
    return api.get('/login/', 'Checking login', {statusCode: {401: out_cb}})
      .done(in_cb)
  },


  logout: function () {return api.put('/logout', 'Logout')}
}
