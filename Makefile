# Makefile for TurboBallz
PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

SRC_DIR := src
BUILD_DIR := build

JS_ENTRY := $(SRC_DIR)/app.js
JS_BUILD := $(patsubst src/%.js, $(BUILD_DIR)/%.js, $(JS_ENTRY))

# browserifyinc caches builds to this file
JS_BUILD_CACHE := .main.cache.json

HTML_SOURCE := $(wildcard $(SRC_DIR)/*.html)
HTML_BUILD := $(patsubst $(SRC_DIR)/%.html, $(BUILD_DIR)/%.html, $(HTML_SOURCE)) 

.PHONY: all clean watch 

all: $(HTML_BUILD) $(JS_BUILD)

$(JS_BUILD): $(JS_ENTRY)
	mkdir -p $(dir $@)
	browserifyinc --cachefile $(JS_BUILD_CACHE) --entry $< --outfile $@ --transform babelify

$(HTML_BUILD): $(HTML_SOURCE)
	mkdir -p $(dir $@)
	cp $? $(dir $@) 

watch:
	while true; do make --silent; sleep 1; done

clean:
	find $(BUILD_DIR) -depth -maxdepth 3 | xargs -P 5 -n 5 rm -rf
	rm $(JS_BUILD_CACHE)

