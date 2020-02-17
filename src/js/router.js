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

module.exports = new VueRouter({
  routes : [
    {path: '/',                 component: {template: '#main-view-template'}},
    {path: '/about',            component: {template: '#about-view-template'}},
    {path: '/account/settings', component: require('./account-settings')},
    {path: '/account/register', component: require('./account-settings')},
    {path: '/charts',           redirect: '/charts/team'},
    {path: '/charts/:series',   component: require('./charts-view')},
    {path: '/top',              redirect: '/top/team'},
    {path: '/top/:series',      component: require('./top-view')},


    {
      path: '/account/:id',
      component: require('./account-view'),
      children: [
        {path: '',         redirect: 'charts'},
        {path: 'charts',   component: require('./account-charts')},
        {path: 'wus',      component: require('./account-wus')},
        {path: 'machines', component: require('./account-machines')}
      ]
    },


    {
      path: '/team/:id',
      component: require('./team-view'),
      children: [
        {path: '',       redirect: 'charts'},
        {path: 'charts', component: require('./team-charts')},
        {path: 'wus',    component: require('./team-wus')}
      ]
    },


    {path: '*', redirect: '/'}
  ]
});
