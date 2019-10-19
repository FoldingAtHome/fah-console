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

function get_log(type) {
  if (type == 'error') return console.error;
  if (type == 'warn')  return console.warning;
  if (type == 'debug') return console.debug;
  return console.log;
}


var message = module.exports = {
  message: function (type, title, msg) {
    get_log(type)(msg);

    var dialog = $('<div>');

    var close = function () {
      var e = dialog;
      return function () {e.remove();}
    }();

    dialog
      .addClass('modal message')

      .append($('<div>')
              .addClass('modal-header')
              .append($('<h2>').text(title)))

      .append($('<div>')
              .attr('class', 'modal-content')
              .html(msg))

      .append($('<div>')
              .addClass('modal-footer')
              .append($('<button>')
                      .on('click', close)
                      .append($('<div>').addClass('fa fa-check'))
                      .text('Ok')))

      .prependTo('body');

    return dialog;
  },


  info:  function (title, msg) {message.message('info',  title, msg)},
  error: function (title, msg) {message.message('error', title, msg)},
  warn:  function (title, msg) {message.message('warn',  title, msg)}
}
