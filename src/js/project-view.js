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

/* globals THREE */

require('./BufferGeometryUtils');
var api = require('./api');


var HYDROGEN = 1;
var CARBON   = 6;
var NITROGEN = 7;
var OXYGEN   = 8;
var SULFUR   = 16;
var HEAVY    = 999;


module.exports = {
  template: '#project-view-template',
  props: ['topology', 'positions', 'id'],


  data: function () {
    return {
      message: 'Loading...',
      draw_type: 3,
      frame: 0,
      pause_rotation: false,
      clock: new THREE.Clock(),

      project: {}
    }
  },


  mounted: function () {
    api.get('/project/' + this.id, 'Getting project info')
      .done(function (project) {this.project = project}).bind(this)
      .always(this.load);
  },


  beforeDestroy: function () {
    window.removeEventListener('mousedown', this.mouse_down);
    window.removeEventListener('keyup', this.key_up);
    window.removeEventListener('wheel', this.wheel);
    window.removeEventListener('resize', this.update_view);
    window.cancelAnimationFrame(this.animate);
  },


  watch: {
    pause_rotation: function () {this.clock.start()}
  },


  computed: {
    target: function () {return this.$el}
  },


  methods: {
    load: function () {
      this.graphics()

      if (typeof this.positions == 'undefined') return this.$emit('close');

      this.draw();
      this.update_view()
      this.render();

      this.message = '';

      window.addEventListener('mousedown', this.mouse_down, false);
      window.addEventListener('keyup', this.key_up, false);
      window.addEventListener('wheel', this.wheel, false);

      //this.next_frame();
    },


    next_frame: function () {
      this.protein.remove(this.proteins[this.frame]);
      if (this.proteins.length <= ++this.frame) this.frame = 0;
      this.protein.add(this.proteins[this.frame]);

      if (this.proteins.length < this.positions.length &&
          this.proteins.length < 5) {
        var p = this.draw_protein(this.proteins.length, this.draw_type);
        this.proteins.push(p);
      }

      setTimeout(this.next_frame, 3000);
    },


    graphics: function () {
      try {
        // Renderer
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0, 0);

        this.target.appendChild(this.renderer.domElement);

      } catch (e) {
        console.log(e);
        alert('WebGL not supported');
        return;
      }

      // Camera
      this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000);

      // Lighting
      this.ambient = new THREE.AmbientLight(0xffffff, 0.5);

      var keyLight = new THREE.DirectionalLight
      (new THREE.Color('hsl(30, 100%, 75%)'), 0.75);
      keyLight.position.set(-100, 0, 100);

      var fillLight = new THREE.DirectionalLight
      (new THREE.Color('hsl(240, 100%, 75%)'), 0.25);
      fillLight.position.set(100, 0, 100);

      var backLight = new THREE.DirectionalLight(0xffffff, 0.5);
      backLight.position.set(100, 0, -100).normalize();

      this.lights = new THREE.Group();
      this.lights.add(keyLight);
      this.lights.add(fillLight);
      this.lights.add(backLight);

      // Events
      window.addEventListener('resize', this.update_view, false);
    },


    render: function () {
      this.animate = window.requestAnimationFrame(this.render);
      if (typeof this.scene == 'undefined') return;
      if (typeof this.rotate_startX == 'undefined' && !this.pause_rotation)
        this.protein.rotation.y += this.clock.getDelta() / 5;
      this.renderer.render(this.scene, this.camera);
    },


    get_dims: function () {
      var t = $(this.target);
      var width = t.innerWidth();
      var height = t.innerHeight() - 4;
      return {width: width, height: height};
    },


    update_view: function () {
      var dims = this.get_dims();
      this.camera.aspect = dims.width / dims.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(dims.width, dims.height);
    },


    make_materials: function () {
      var shine = [60, 20, 25, 30, 30, 100];

      var specular = [
        new THREE.Color(0.45, 0.45, 0.50), // Carbon
        new THREE.Color(0.20, 0.20, 0.20), // Hydrogen
        new THREE.Color(0.20, 0.20, 0.20), // Nitrogen
        new THREE.Color(0.20, 0.20, 0.20), // Oxygen
        new THREE.Color(0.20, 0.20, 0.20), // Sulfur
        new THREE.Color(0.25, 0.50, 0.25), // Heavy atoms
      ];

      var color = [
        new THREE.Color(0.20, 0.20, 0.20), // dark grey
        new THREE.Color(0.60, 0.60, 0.60), // grey
        new THREE.Color(0.10, 0.10, 0.80), // blue
        new THREE.Color(0.80, 0.15, 0.15), // red
        new THREE.Color(0.60, 0.60, 0.15), // yellow
        new THREE.Color(0.50, 0.00, 0.60), // purple
      ];

      var material = this.draw_type == 3 ? THREE.MeshPhysicalMaterial :
          THREE.MeshPhongMaterial;

      this.atom_materials = []
      for (var i = 0; i < 6; i++)
        this.atom_materials.push(
          new material({
            shininess: shine[i], specular: specular[i], color: color[i]}))

      this.bond_material =
        new THREE.MeshPhongMaterial({
          shininess: 50,
          specular: new THREE.Color(0.45, 0.45, 0.50),
          color: new THREE.Color(1, 1, 1),
          opacity: 0.6, transparent: true
        })
    },


    atom_type_from_number: function (number) {
      switch (number) {
      case HYDROGEN: return 0;
      case CARBON:   return 1;
      case NITROGEN: return 2;
      case OXYGEN:   return 3;
      case SULFUR:   return 4;
      default:       return 5;
      }
    },


    radius_from_type: function (type) {
      return 0.1 * [1.09, 1.7, 1.55, 1.52, 1.8, 1][type];
    },


    number_from_name: function (name) {
      if (!name.length) return HEAVY;

      switch (name[0].toUpperCase()) {
      case 'H': return HYDROGEN;
      case 'C': return CARBON;
      case 'N': return NITROGEN;
      case 'O': return OXYGEN;
      case 'S': return SULFUR;
      default:
        if (1 < name.length) return this.number_from_name(name.substr(1));
        return HEAVY;
      }
    },


    get_atom: function (atom, draw_type) {
      var number = atom[4] ? atom[4] : this.number_from_name(atom[0]);
      var type = this.atom_type_from_number(number);
      var radius = 0 < atom[2] ? atom[2] : this.radius_from_type(type);

      if (draw_type == 1) radius /= 3;
      if (draw_type == 2) radius = 0.025;

      var segs = draw_type == 3 ? 20 : 8;

      return {
        number: number, type: type, radius: radius,
        geometry: new THREE.SphereBufferGeometry(radius, segs, segs)
      }
    },


    draw_atoms: function (index, draw_type) {
      var group = new THREE.Group();
      var pos = this.positions[index];

      // Atoms
      this.atoms = [];
      var atom_geometries = [];
      for (var i = 0; i < 5; i++) atom_geometries.push([]);

      var atoms = this.topology.atoms;
      for (i = 0; i < atoms.length; i++) {
        var atom = this.get_atom(atoms[i], draw_type);
        atom.geometry.translate(pos[i][0], pos[i][1], pos[i][2]);
        atom_geometries[atom.type].push(atom.geometry);
        this.atoms.push(atom.geometry);
      }

      for (var type = 0; type < 5; type++) {
        var geo = THREE.BufferGeometryUtils
            .mergeBufferGeometries(atom_geometries[type]);
        var mesh = new THREE.Mesh(geo, this.atom_materials[type]);
        group.add(mesh);
      }

      return group;
    },


    get_bond_geometry: function (a, b) {
      var vA = new THREE.Vector3(a[0], a[1], a[2]);
      var vB = new THREE.Vector3(b[0], b[1], b[2]);
      var length = vA.distanceTo(vB);
      var r = 0.02;

      var geometry = new THREE.CylinderBufferGeometry(r, r, length, 8, 1, true);
      geometry.translate(0, length / 2, 0);

      // Rotate
      var vec = vB.clone().sub(vA);
      var h = vec.length();
      vec.normalize();

      var q = new THREE.Quaternion();
      q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);

      var m = new THREE.Matrix4();
      m.makeRotationFromQuaternion(q);
      geometry.applyMatrix(m);

      // Final translation
      geometry.translate(vA.x, vA.y, vA.z);

      return geometry;
    },


    draw_bonds: function (index) {
      var group = new THREE.Group();
      var pos = this.positions[index];
      var bonds = this.topology.bonds;
      var bond_geometries = [];

      for (var i = 0; i < bonds.length; i++) {
        var a = pos[bonds[i][0]];
        var b = pos[bonds[i][1]];
        bond_geometries.push(this.get_bond_geometry(a, b));
      }

      var geometry =
        THREE.BufferGeometryUtils.mergeBufferGeometries(bond_geometries);

      return new THREE.Mesh(geometry, this.bond_material);
    },


    draw_protein: function (index, draw_type) {
      var group = new THREE.Group();

      group.add(this.draw_atoms(index, draw_type));

      if (draw_type == 1 || draw_type == 2)
        group.add(this.draw_bonds(index));

      return group;
    },


    draw: function () {
      this.make_materials();

      var scene = new THREE.Scene();

      // Lights
      scene.add(this.ambient);
      scene.add(this.lights);

      // Model
      this.protein = new THREE.Group();
      this.proteins = [this.draw_protein(0, this.draw_type)];
      this.protein.add(this.proteins[0]);
      this.protein.rotation.y = Math.PI * 45 / 180;
      scene.add(this.protein);

      var bbox = new THREE.Box3().setFromObject(this.protein);
      var center = bbox.getCenter(new THREE.Vector3());
      var dims = bbox.getSize(new THREE.Vector3());
      var maxDim = Math.max(dims.x, dims.y, dims.z);

      center.x -= dims.x * 0.2; // Shift right

      var initialZ = center.z +
          maxDim / 2 / Math.tan(Math.PI * this.camera.fov / 360);

      this.__zoom = {
        initial: initialZ,
        min: center.z + maxDim / 1.25,
        max: initialZ * 2
      }

      this.camera.position.x = center.x;
      this.camera.position.y = center.y;
      this.camera.position.z = initialZ;
      this.camera.lookAt(center);

      this.scene = scene;
    },


    zoom: function (delta) {
      var totalZ = this.__zoom.max - this.__zoom.min;
      var z = this.camera.position.z + delta / totalZ * 10;
      if (z < this.__zoom.min) z = this.__zoom.min;
      if (this.__zoom.max < z) z = this.__zoom.max;
      this.camera.position.z = z;
    },


    zoom_in: function () {this.zoom(4)},
    zoom_out: function () {this.zoom(-4)},
    wheel: function (e) {this.zoom(e.deltaY < 0 ? -1 : 1)},


    rotate: function (delta) {
      var width = this.get_dims().width;
      this.protein.rotation.y =
        this.rotate_startRot + 2 * Math.PI * delta / width;
    },


    mouse_move: function (e) {
      e.preventDefault();
      if (typeof this.rotate_startX != 'undefined')
        this.rotate(e.clientX - this.rotate_startX);
    },


    mouse_down: function (e) {
      e.preventDefault();
      if (e.button == THREE.MOUSE.LEFT) {
        this.rotate_startX = e.clientX;
        this.rotate_startRot = this.protein.rotation.y;
        window.addEventListener('mousemove', this.mouse_move, false);
        window.addEventListener('mouseup', this.mouse_up, false);
      }
    },


    mouse_up: function (e) {
      e.preventDefault();
      if (e.button == THREE.MOUSE.LEFT) {
        this.rotate_startX = undefined;
        this.clock.start();
        window.removeEventListener('mousemove', this.mouse_move, false);
        window.removeEventListener('mouseup', this.mouse_up, false);
      }
    },


    set_draw_type: function (type) {
      if (0 < type && type < 4 && this.draw_type != type) {
        this.draw_type = type;
        var rotation = this.protein.rotation.y;
        var zoom = this.camera.position.z;
        this.draw();
        this.protein.rotation.y = rotation;
        this.camera.position.z = zoom;
        this.clock.start();
      }
    },


    key_up: function (e) {this.set_draw_type(parseInt(e.key))}
  }
}
