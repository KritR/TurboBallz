"use strict";
import { Bodies, Body } from 'matter-js';
import { DEFAULT_CATEGORY, RECT_CATEGORY , BALL_CATEGORY } from './collision-categories.js';

const BALL_VELOCITY = 0.5;

export default class Ball {
  static create(x,y,radius){
    const body = Bodies.circle(x, y, radius, { 
      collisionFilter: {
        category: BALL_CATEGORY,
        mask: DEFAULT_CATEGORY | RECT_CATEGORY
      },
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0
    });
    body.radius = radius;
    body.isBall = true;
    body.getGraphic = function(){
      return new PIXI.Circle(this.position.x, this.position.y, this.radius);
    }
    return body;
  }
}
