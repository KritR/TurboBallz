/* @flow */
"use strict";
import { Graphics } from 'pixi.js';
import { Body } from 'matter-js';

export default class Entity {
  graphic: ?Graphics;
  body: ?Body;
  destroyed: boolean = false;
  
  constructor(body: ?Body, graphic: ?Graphics) {
    this.body = body;
    this.graphic = graphic;
    if(this.body != null) {
      this.body.entity = this;
    }
  }
  update(){
  }
  destroy(){
    this.destroyed = true;
  }
}
