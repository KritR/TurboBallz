/* @flow */
"use strict";
import { Bodies, Body } from 'matter-js';
import { DEFAULT_CATEGORY, RECT_CATEGORY , BALL_CATEGORY } from './collision-categories.js';
import { Graphics, Circle } from 'pixi.js';
import Entity from './entity.js';

const COLOR = 0xFFFFFF;

export default class Ball extends Entity{
  graphic: Graphics;
  body: Body;
  constructor(x: number, y: number, radius: number){
    const graphic = new Graphics();
    const shape = new Circle(0, 0, radius);
    graphic.beginFill(COLOR);
    graphic.drawShape(shape);
    const body = Bodies.circle(x, y, radius, { 
      collisionFilter: {
        category: BALL_CATEGORY,
        mask: DEFAULT_CATEGORY | RECT_CATEGORY
      },
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      inertia: 4294967295,
      restitution: 1
    });
    super(body,graphic);
  }
  update() {
      this.graphic.x = this.body.position.x
      this.graphic.y = this.body.position.y
  }
}
