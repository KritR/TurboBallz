/* @flow */
"use strict";
import { Bodies, Body } from 'matter-js';
import Entity from './entity.js';
import { Graphics, Shape, Circle } from 'pixi.js';

const COLOR = 0xFFFFFF;

export default class OnePlus extends Entity {
  graphic: Graphics;
  body: Body;
  radius: number;
  outline: Circle;
  innerCirc: Circle;
  constructor(x: number,y: number, radius: number) {
    const body = Bodies.circle(x,y, radius, {
      isSensor: true,
      isStatic: true
    });
    const graphic = new Graphics();
    graphic.iter = 0;
    super(body,graphic);
    this.radius = radius;
    this.outline = new Circle(0,0, radius);
    this.innerCirc = new Circle(0,0, radius * 0.6);
  }
  update() {
    this.graphic.iter++;
    this.outline.radius = this.radius + Math.sin(this.graphic.iter * 0.05);
    this.graphic.x = this.body.position.x
    this.graphic.y = this.body.position.y
    this.graphic.clear();
    this.graphic.lineStyle(4,COLOR);
    this.graphic.drawShape(this.outline);
    this.graphic.lineStyle(0);
    this.graphic.beginFill(COLOR);
    this.graphic.drawShape(this.innerCirc);
    this.graphic.endFill();  
  }
}
