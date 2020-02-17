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


function _time_duration(x, name, precision) {
  x = x.toFixed(typeof precision == 'undefined' ? 0 : precision);
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


  human_duration: function (x, precision) {
    if (SEC_PER_YEAR <= x)
      return _time_duration(x / SEC_PER_YEAR,  'year',  precision);
    if (SEC_PER_MONTH <= x)
      return _time_duration(x / SEC_PER_MONTH, 'month', precision);
    if (SEC_PER_WEEK <= x)
      return _time_duration(x / SEC_PER_WEEK,  'week',  precision);
    if (SEC_PER_DAY <= x)
      return _time_duration(x / SEC_PER_DAY,   'day',   precision);
    if (SEC_PER_HOUR <= x)
      return _time_duration(x / SEC_PER_HOUR,  'hour',  precision);
    if (SEC_PER_MIN <= x)
      return _time_duration(x / SEC_PER_MIN,   'min',   precision);
    return _time_duration(x, 'sec', precision);
  },


  human_number: function (x, precision) {
    if (typeof precision == 'undefined') precision = 1;

    if (1e12 <= x) return (x / 1e12).toFixed(precision) + 'T'
    if (1e9  <= x) return (x / 1e9 ).toFixed(precision) + 'B'
    if (1e6  <= x) return (x / 1e6 ).toFixed(precision) + 'M'
    if (1e3  <= x) return (x / 1e3 ).toFixed(precision) + 'K'
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


  capitalize: function (s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  },


  os_icon: function (os) {
    if (typeof os != 'undefined') {
      os = os.toLowerCase();
      if (os == 'linux')   return 'fa-linux';
      if (os == 'windows') return 'fa-windows';
      if (os == 'macosx')  return 'fa-apple';
    }

    return 'fa-question';
  },


  status_icon: function (status) {
    if (typeof status != 'undefined') {
      if (status == 'ok')       return 'fa-check success';
      if (status == 'failed')   return 'fa-times';
      if (status == 'faulty')   return 'fa-times';
      if (status == 'dumped')   return 'fa-trash';
      if (status == 'noassign') return 'fa-times-circle';
      if (status == 'expired')  return 'fa-clock-o';
    }

    return 'fa-question';
  },


  wu_prcg: function (wu) {
    return 'Project:' + wu.project + ' Run:' + wu.run + ' Clone:' + wu.clone +
      ' Generation:' + wu.gen;
  }
}
