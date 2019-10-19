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

/* globals PerfectScrollbar */

var login   = require('./login');
var api     = require('./api');
var message = require('./message');
var util = require('./util');

var fah_url  = 'https://foldingathome.org/'
var fah_logo = fah_url + 'logo.png'


function get_series(series, cb) {
  var data = [];

  for (var i = 0; i < series.length; i++)
    data.push({
      x: series[i].ts + 'Z',
      y: cb(series[i])
    });

  return data;
}


module.exports = {
  el: '#page',
  mixins: [require('./dialogs.js')],


  data: function ()  {
    return {
      aid: util.query_get('aid', 5796),
      loading: true,
      logged_in: false,
      default_team_logo: fah_logo,
      clients: ['127.0.0.1:7397'],
      account: {}
    }
  },


  components: {
    'fah-client':       require('./fah-client'),
    'account-settings': require('./account-settings'),
    'team-settings':    require('./team-settings'),
    'time-series':      require('./time-series')
  },


  computed: {
    series: function () {
      return [
        this.get_hourly_series_field('credit'),
        this.get_hourly_series_field('rank'),
        this.get_hourly_series_return_rate(),
        this.get_hourly_series_field('assigned'),
        this.get_hourly_series_field('confirmed'),
        this.get_hourly_series_field('failed'),
        this.get_hourly_series_field('faulty'),
        this.get_hourly_series_field('dumped'),
        this.get_hourly_series_field('expired'),
        this.get_hourly_series_field('finished'),
      ]
    }
  },


  mounted: function () {
    $('#content').each(function () {new PerfectScrollbar(this)})
    //$('.sidebar.right > div').each(function () {new PerfectScrollbar(this)})
    //login.check(this._logged_in, this._logged_out);

    this.account_load(this.aid); // TODO get aid from login
  },


  methods: {
    _logged_in: function (info) {
      this.loading = false;
      this.info = info;
      this.logged_in = true;
      this.account_load(info.uid);
    },


    _logged_out: function () {
      this.loading = false;
      this.logged_in = false;
      this.user = {};
    },


    login: function () {login.login()},
    logout: function () {login.logout().done(this._logged_out)},


    account_not_found: function() {
      this.account.avatar = this.info.avatar;
      this.account.name = this.info.name;
      this.open_dialog('settings');
    },


    account_set: function (account) {this.account = account},


    account_load: function (uid) {
      api.get('/accounts/' + uid, 'Account lookup', {
        statusCode: {404: this.account_not_found}})
        .done(this.account_set)
    },


    get_hourly_series: function(title, cb) {
      var user = this.account.hourly || [];
      var team = this.account.team_hourly || [];

      return {
        title: title,
        series: [
          {
            label: 'User ' + title,
            period: 'hour',
            color: '#62858c',
            position: 'left',
            data: get_series(user, cb)

          }, {
            label: 'Team ' + title,
            period: 'hour',
            color: 'green',
            position: 'right',
            data: get_series(team, cb)
          }
        ]
      }
    },


    get_hourly_series_field: function(field) {
      return this.get_hourly_series(field, function (e) {return e[field]})
    },


    get_hourly_series_return_rate: function() {
      function cb (e) {return e.finished / e.assigned * 100}
      return this.get_hourly_series('return rate', cb)
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


    get_prcg: function (wu) {
      return 'Project:' + wu.project + ' Run:' + wu.run + ' Clone:' + wu.clone +
        ' Generation:' + wu.gen;
    },


    is_active: function (time) {
      return new Date().getTime() -  Date.parse(time + 'Z') <
        50 * 24 * 60 * 60 * 1000;
    },


    save_settings: function () {
      var data = {
        name:   this.account.name,
        avatar: this.account.avatar,
        team:   this.account.team
      }

      api.put('/accounts/' + this.info.uid, 'Saving account settings', data)
        .done(function () {this.close_dialog('settings')}.bind(this));
    },


    get_type: function (m) {
      if (m.gpus) return m.gpu_vendor;
      return 'cpu:' + m.cpus;
    },


    show_project: function (project, topology, positions) {
      this.project_id = project;
      this.topology = topology;
      this.positions = positions;
      this.open_dialog('project');
    }
  }
}
