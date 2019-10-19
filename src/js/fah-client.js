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


module.exports = {
  template: '#fah-client-template',
  props: ['address'],
  mixins: [require('./dialogs.js')],


  data: function () {
    return {
      data: {config: {}, info: {}},
      connected: false,
      first: true
    }
  },


  components: {
    'client-settings': require('./client-settings'),
    'work-unit': require('./work-unit')
  },


  mounted: function () {this.connect()},


  computed: {
    units: function () {
      if (typeof this.data.units == 'undefined') return [];
      return this.data.units;
    }
  },


  methods: {
    connect: function() {
      console.log('Connecting to', this.address);
      this.websock = new WebSocket('ws://' + this.address + '/api/websocket');
      this.websock.addEventListener('message', this.on_message);
      this.websock.addEventListener('open', this.on_open);
      this.websock.addEventListener('close', this.on_close);
    },


    send: function(msg) {this.websock.send(JSON.stringify(msg))},


    on_close: function() {
      console.log('Websocket closed');
      setTimeout(this.connect, 1000);
      this.connected = false;
    },


    on_open: function() {
      console.log('Websocket opened');
      this.connected = true;
      this.first = true;
    },


    on_message: function(event) {
      console.log('Websocket message: ' + event.data);
      var data = JSON.parse(event.data);

      if (this.first) {
        this.first = false;
        this.data = data;

      } else {
        var d = this.data;

        for (var i = 0; i < data.length - 1; i++) {
          var e = data[i];

          if (i == data.length - 2) {
            if (data[i + 1] === null) Vue.delete(d, e);
            else Vue.set(d, e, data[i + 1]);

          } else d = d[e];
        }
      }
    },


    pause: function(pause, unit) {
      this.send({
        cmd: pause ? "pause" : "unpause",
        unit: unit
      });
    },


    save_settings: function () {
      this.send({
        cmd: 'config',
        config: this.data.config
      });

      this.close_dialog();
    }
  }
}
