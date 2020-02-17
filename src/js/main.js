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

$(function () {
  if (!Object.defineProperty) {$('#incompatible-browser').show(); return;}

  require('./filters')();

  Vue.component('progress-bar',      require('./progress-bar'));
  Vue.component('project-view',      require('./project-view'));
  Vue.component('time-series',       require('./time-series'));
  Vue.component('line-chart',        require('./line-chart'));
  Vue.component('top-table',         require('./top-table'));
  Vue.component('recent-wus',        require('./recent-wus'));
  Vue.component('recent-machines',   require('./recent-machines'));
  Vue.component('team-accounts',     require('./team-accounts'));
  Vue.component('int-input',         require('./int-input'));
  Vue.component('team-input',        require('./team-input'));
  Vue.component('team-charts',       require('./team-charts'));
  Vue.component('field-description', require('./field-description'));

  new Vue(require('./app')).$mount('#app')
})
