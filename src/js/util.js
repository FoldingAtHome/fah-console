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

var SEC_PER_YEAR  = 365 * 24 * 60 * 60;
var SEC_PER_MONTH = 30 * 24 * 60 * 60;
var SEC_PER_WEEK  = 7 * 24 * 60 * 60;
var SEC_PER_DAY   = 24 * 60 * 60;
var SEC_PER_HOUR  = 60 * 60;
var SEC_PER_MIN   = 60;


function _time_duration(x, name) {
  x = x.toFixed(0);
  return x + ' ' + name + (x == 1 ? '' : 's')
}


var util = module.exports = {
  cookie_get: function(name) {
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    name = name + '=';

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (!c.indexOf(name)) return c.substring(name.length, c.length);
    }

    return '';
  },


  cookie_set: function(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  },


  uri_encode_values: function(values) {
    var s = '';

    for (var name in values) {
      if (s != '') s += '&';
      s += encodeURIComponent(name) + '=' + values[name];
    }

    return s;
  },


  uri_get: function(str, name, defaultValue) {
    var regex = new RegExp('((^[\\?#]?)|[&])' + name + '=([^&#]*)');
    var results = regex.exec(str);
    return results === null ?
      (typeof defaultValue == 'undefined' ? '' : defaultValue) :
    decodeURIComponent(results[3].replace(/\+/g, ' '));
  },


  query_get: function(name, defaultValue) {
    return util.uri_get(location.search, name, defaultValue);
  },


  query_set: function(values) {
    location.search = util.uri_encode_values(values);
  },


  hash_get: function(name, defaultValue) {
    return util.uri_get(location.hash, name, defaultValue);
  },


  hash_set: function(values) {
    location.hash = util.uri_encode_values(values);
  },


  query_hash_get: function(name, defaultValue) {
    return util.query_get(name, util.hash_get(name, defaultValue));
  },


  human_duration: function (x) {
    if (SEC_PER_YEAR <= x)  return _time_duration(x / SEC_PER_YEAR,  'year');
    if (SEC_PER_MONTH <= x) return _time_duration(x / SEC_PER_MONTH, 'month');
    if (SEC_PER_WEEK <= x)  return _time_duration(x / SEC_PER_WEEK,  'week');
    if (SEC_PER_DAY <= x)   return _time_duration(x / SEC_PER_DAY,   'day');
    if (SEC_PER_HOUR <= x)  return _time_duration(x / SEC_PER_HOUR,  'hour');
    if (SEC_PER_MIN <= x)   return _time_duration(x / SEC_PER_MIN,   'min');
    return _time_duration(x, 'sec');
  },


  human_number: function (x) {
    if (1e12 <= x) return (x / 1e12).toFixed(1) + 'T'
    if (1e9  <= x) return (x / 1e9 ).toFixed(1) + 'B'
    if (1e6  <= x) return (x / 1e6 ).toFixed(1) + 'M'
    if (1e3  <= x) return (x / 1e3 ).toFixed(1) + 'K'
    return x;
  },


  copy_to_clipboard: function (s) {
    var e = document.createElement('textarea');
    e.value = s;
    document.body.appendChild(e);
    e.focus();
    e.select();
    document.execCommand('copy');
    document.body.removeChild(e);
  },


  overlay_create: function (parent, close) {
    if (typeof parent == 'undefined') parent = document.body;

    var overlay = $('<div>');

    overlay.close_overlay = function () {
      var closed = false;
      var e = overlay;

      return function () {
        if (closed) return;
        closed = true;
        e.remove();
        if (close) close();
      }
    }();

    overlay
      .attr('class', 'overlay')
      .on('click', overlay.close_overlay)
      .appendTo(parent);

    return overlay;
  }
}
