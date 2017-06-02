"use strict";
import { Bodies, Body } from 'matter-js';
import { DEFAULT_CATEGORY, RECT_CATEGORY , BALL_CATEGORY } from './collision-categories.js';

const BALL_RADIUS = 4;
const BALL_VELOCITY = 0.5;

export default class Ball {
  constructor(x,y, radius = BALL_RADIUS, angle = 0, velocity = BALL_VELOCITY){
    this.radius = radius;
    this.body = Bodies.circle(x, y, radius, { 
      collisionFilter: {
        category: BALL_CATEGORY,
        mask: DEFAULT_CATEGORY | RECT_CATEGORY
      },
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0
    });
    Body.setAngle(this.body, angle);
    Body.setVelocity(this.body, velocity);
    // May Be setAngularVelocity
  }  
  getPhysicsBody(){
    return this.body;
  }
  getRenderBody(){
    return new PIXI.Circle(this.body.position.x, this.body.position.y, this.radius);
  }
}
