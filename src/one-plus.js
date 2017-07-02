"use strict";
import { Bodies } from 'matter-js';

const COLOR = 0xFFFFFF;

export default class OnePlus {
  static create(x,y, radius) {
    const body = Bodies.circle(x,y, radius, {
      isSensor: true,
      isStatic: true
    });
    const graphic = new PIXI.Graphics();
    const outline = new PIXI.Circle(0,0, radius);
    const innerCirc = new PIXI.Circle(0,0, radius * 0.6);
    graphic.lineStyle(4,COLOR);
    graphic.drawShape(outline);
    graphic.lineStyle(0);
    graphic.beginFill(COLOR);
    graphic.drawShape(innerCirc);
    graphic.endFill();  
    body.renderable = true;
    body.graphic = graphic;
    body.isOnePlus = true;
    body.update = () => {
      body.graphic.x = body.position.x
      body.graphic.y = body.position.y
    }
    return body;
  }
}
