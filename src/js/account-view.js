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


module.exports = {
  template: '#account-view-template',

  data: function ()  {
    return {
      aid: 0,
      account: undefined,
      enums: require('./enums'),
      field: 'credit',
      period: 'daily',
      count: 100
    }
  },


  components: {
    'account-settings': require('./account-settings')
  },


  mounted: function () {this.load()},


  methods: {
    set: function (account) {this.account = account},


    load: function () {
      this.account = undefined;
      this.aid = this.$route.params.id;

      api.get('/accounts/' + this.aid, 'Account lookup', {
        statusCode: {404: this.not_found}})
        .done(this.set)
    },


    not_found: function() {
      message.error('Acount not found', 'Account ' + this.aid +
                    ' not found');
    },


    os_icon: util.os_icon,
    status_icon: util.status_icon,
    wu_prcg: util.wu_pcrg,


    show_project: function (project, topology, positions) {
      this.project_id = project;
      this.topology = topology;
      this.positions = positions;
      this.open_dialog('project');
    }
  }
}
