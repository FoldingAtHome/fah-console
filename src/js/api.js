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
var message = require('./message');

var api_base = 'https://api.foldingathome.org'


function ajax(method, path, action, data, _config) {
  var config = {
    method: method,
    url: api_base + path,
    data: data,
    beforeSend: function (xhr) {
      var sid = util.cookie_get('sid');
      if (sid) xhr.setRequestHeader('Authorization', sid); // Set SID auth
    }
  }

  if (typeof _config != 'undefined') Object.assign(config, _config);

  if (typeof config.data == 'object') {
    if (method == 'DELETE') config.url += '?' + $.param(config.data);
    else if (method != 'GET') {
      config.contentType = 'application/json';
      config.data = JSON.stringify(config.data);
    }
  }

  return $.ajax(config).fail(function (xhr, text, err) {
    if (typeof config.statusCode != 'undefined' &&
        xhr.status in config.statusCode) return;
    if (!xhr.status) return; // Ignore redirects

    var msg;

    try {msg = $.parseJSON(xhr.responseText).error}
    catch(e) {msg = xhr.responseText || 'Unknown error'}

    var title;
    if (typeof action != 'undefined') title = action + ' failed';
    else title = 'API error';

    message.error(title, msg);
  });
}


module.exports = {
  ajax: ajax,


  get: function (path, action, config) {
    return ajax('GET', path, action, undefined, config)
  },


  put: function (path, action, data, config) {
    return ajax('PUT', path, action, data, config)
  },


  post: function (path, action, data, config) {
    return ajax('POST', path, action, data, config)
  },


  delete: function (path, action, config) {
    return ajax('DELETE', path, action, undefined, config)
  }
}
