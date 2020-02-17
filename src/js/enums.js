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
  series: 'account team project as os cpus gpu core version'.split(' '),
  periods: 'hourly daily weekly monthly'.split(' '),
  fields:
  'credit delta assigned confirmed finished failed faulty dumped'.split(' '),


  field_description: function (field) {
    return {
      credit:    'Points earned',
      delta:     'Average Work Unit completion time',
      assigned:  'Number of Work Units assigned',
      confirmed: 'Number of Work Units downloaded from a Work Server',
      finished:  'Number of Work Units completed successfully',
      failed:    'Number of Failed Work Units',
      faulty:    'Number of Faulty Work Units',
      dumped:    'Number of Work Units Dumped'
    }[field]
  },


  series_description: function (series) {
    return {
      account: 'Account',
      team:    'Team',
      project: 'Project',
      as:      'Assignment Server',
      os:      'Operating System',
      cpus:    'CPU Count',
      gpu:     'GPU',
      core:    'Simulation Core',
      version: 'Client Version'
    }[series]
  }
}
