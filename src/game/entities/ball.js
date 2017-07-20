/* @flow */
"use strict";
import { Bodies, Body, Vector } from 'matter-js';
import { DEFAULT_CATEGORY, RECT_CATEGORY , BALL_CATEGORY } from './collision-categories.js';
import { Graphics, Circle } from 'pixi.js';
import Entity from '../lib/entity.js';

const COLOR = 0xFFFFFF;

export default class Ball extends Entity{
  graphic: Graphics;
  body: Body;
  constructor(x: number, y: number, radius: number, speed: number, direction: Vector){
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
      inertia: Infinity,
      restitution: 1
    });
    const velocity = Vector.mult(Vector.normalise(direction),speed);
    Body.setVelocity(body, velocity);
    super(body,graphic);
  }
  update() {
      this.graphic.x = this.body.position.x;
      this.graphic.y = this.body.position.y;
  }
}
