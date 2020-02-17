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

var api     = require('./api');
var message = require('./message');
var util    = require('./util');

var fah_url  = 'https://foldingathome.org/'
var fah_logo = fah_url + 'logo.png'


module.exports = {
  template: '#team-view-template',


  data: function ()  {
    return {
      team_id: 0,
      team: undefined,
      default_team_logo: fah_logo,
      enums: require('./enums'),
      period: 'daily',
      field: 'credit',
      count: 100
    }
  },


  computed: {
    url: function () {
      if (/^https?:\/\//.test(this.team.url)) return this.team.url;
      return 'https://' + this.team.url;
    },


    rank_title: function () {
      return this.team.rank.toLocaleString() + ' of ' +
        this.team.teams.toLocaleString()
    },


    points_title: function () {
      return this.team.score.toLocaleString() + ' total points'
    },


    wus_title: function () {
      return this.team.wus.toLocaleString() + ' total work units'
    },


    members_title: function () {
      return this.team.members.toLocaleString() + ' members'
    }
  },


  watch: {
    $route: function (to, from) {
      if (typeof this.team != 'undefined' &&
          this.$route.params.id != this.team.id) this.load()
    },


    team_id: function (value) {
      if (this.$route.params.id != value)
        this.$router.push('/team/' + value)
    }
  },


  components: {
    'team-settings': require('./team-settings')
  },


  mounted: function () {this.load()},


  methods: {
    set: function (team) {this.team = team},


    load: function () {
      this.team_id = this.$route.params.id;
      this.team = undefined;

      api.get('/team/' + this.team_id, 'Team lookup', {
        statusCode: {404: this.not_found}})
        .done(this.set)
    },


    not_found: function() {
      message.error('Team not found', 'Team ' + this.team_id + ' not found');
    }
  }
}
