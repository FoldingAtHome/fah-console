################################################################################
#                                                                              #
#                 Copyright (c) 2018, Cauldron Development LLC                 #
#                             All rights reserved.                             #
#                                                                              #
#     This file ("the software") is free software: you can redistribute it     #
#     and/or modify it under the terms of the GNU General Public License,      #
#      version 2 as published by the Free Software Foundation. You should      #
#      have received a copy of the GNU General Public License, version 2       #
#     along with the software. If not, see <http: #www.gnu.org/licenses/>.     #
#                                                                              #
#     The software is distributed in the hope that it will be useful, but      #
#          WITHOUT ANY WARRANTY; without even the implied warranty of          #
#      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU       #
#               Lesser General Public License for more details.                #
#                                                                              #
#       You should have received a copy of the GNU Lesser General Public       #
#                License along with the software.  If not, see                 #
#                       <http: #www.gnu.org/licenses/>.                        #
#                                                                              #
#                For information regarding this software email:                #
#              "Joseph Coffland" <joseph@cauldrondevelopment.com>              #
#                                                                              #
################################################################################

DIR := $(shell dirname $(lastword $(MAKEFILE_LIST)))

DEST := joseph@foldingathome.org:/var/www/console.foldingathome.org/html

NODE_MODS := $(DIR)/node_modules
PUG       := $(NODE_MODS)/.bin/pug
JSHINT    := $(NODE_MODS)/.bin/jshint
PUGDEPS   := $(DIR)/scripts/pug-deps

HTML      := index
HTML      := $(patsubst %,build/%.html,$(HTML))

STATIC    := $(shell find static -type f | grep -v ~)
STATIC    += $(patsubst static/%,build/%,$(STATIC))


all: node_modules $(HTML) $(STATIC) lint

publish: all
	rsync -rv build/ --exclude dep $(DEST)/

build/%: static/%
	install -D $< $@

build/%.html: src/pug/%.pug
	$(PUG) -P $< --out build || (rm -f $@; exit 1)
	@mkdir -p build/dep
	@echo -n "$@: " > build/dep/$(shell basename $<)
	@$(PUGDEPS) $< >> build/dep/$(shell basename $<)

lint: node_modules
	$(JSHINT) --config jshint.json src/js/*.js

node_modules:
	npm install

tidy:
	rm -rf $(shell find . -name \*~ -o -name \#\*)

clean: tidy
	rm -rf build

.PHONY: all publish lint tidy clean

# Dependencies
-include $(shell mkdir -p build/dep) $(wildcard build/dep/*)
