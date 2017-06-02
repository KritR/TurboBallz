"use strict";
import { Bodies, Body } from 'matter-js';
import { RECT_CATEGORY } from './collision-categories.js';

const SIDE_LENGTH = 8;

export default class Rect {
  constructor(x,y, side = SIDE_LENGTH){
    this.side = side;
    this.body = Bodies.rectangle(x, y, side, side, { 
      collisionFilter: {
        category: RECT_CATEGORY
      },
      isStatic: true,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0
    });
    // May Be setAngularVelocity
  }  
  getPhysicsBody(){
    return this.body;
  }
  getRenderBody(){
    return new PIXI.Rectangle(this.body.x, this.body.y, this.side, this.side);
  }
}
