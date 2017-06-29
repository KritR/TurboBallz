"use strict";
import { Bodies, Body } from 'matter-js';
import { DEFAULT_CATEGORY, RECT_CATEGORY , BALL_CATEGORY } from './collision-categories.js';

const BALL_VELOCITY = 0.5;

export default class Ball {
  static create(x,y,radius){
    const graphic = new PIXI.Graphics();
    const shape = new PIXI.Circle(0, 0, radius);
    graphic.beginFill(0xFFFFFF);
    graphic.drawShape(shape);
    const body = Bodies.circle(x, y, radius, { 
      collisionFilter: {
        category: BALL_CATEGORY,
        mask: DEFAULT_CATEGORY | RECT_CATEGORY
      },
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      restitution: 1
    });
    body.graphic = graphic;
    body.radius = radius;
    body.renderable = true;
    body.isBall = true;
    body.update = () => {
      body.graphic.x = body.position.x
      body.graphic.y = body.position.y
    }
    body.update();
    return body;
  }
}
