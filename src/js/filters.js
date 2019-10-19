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


var filters = {
  timeduration: function (ts) {
    if (typeof ts == 'string') ts = Date.parse(ts + 'Z') / 1000;

    return util.human_duration(new Date().getTime() / 1000 - ts) + ' ago';
  },


  'timestamp': function (ts) {
    if (typeof ts == 'string') ts = Date.parse(ts + 'Z') / 1000;
    function pad(x) {return x < 10 ? '0' + x : x;}

    var d = new Date(ts * 1000);
    return pad(d.getMonth()) + '/' + pad(d.getDate()) + '/' +
      pad(d.getYear() % 100) + ' ' + d.getHours() + ':' +
      pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  },


  number: function (x) {return util.human_number(x)},


  url: function (url) {return url.replace(/^\w+:\/\//, '')},


  percent: function (x) {return (100 * x).toFixed(2) + '%';},


  href: function (url) {
    if (/^\w+:\/\//.test(url)) return url;
    return 'http://' + url;
  }
}


module.exports = function () {
  for (var name in filters)
    Vue.filter(name, filters[name])
}
