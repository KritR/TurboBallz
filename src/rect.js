"use strict";
import { Bodies, Body } from 'matter-js';
import { RECT_CATEGORY } from './collision-categories.js';


export default class Rect {
  static create(x,y,side,life){
    const body = Bodies.rectangle(x, y, side, side, { 
      collisionFilter: {
        category: RECT_CATEGORY
      },
      isStatic: true,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0
    });

    body.side = side;
    body.life = life;
    body.isRect = true;
    body.visible = true;
    body.getGraphic = function(){
      return new PIXI.Rectangle(this.position.x - this.side/2, this.position.y - this.side/2, this.side, this.side);
    }
    return body;  
  }
}
