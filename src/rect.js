"use strict";
import { Bodies, Body } from 'matter-js';
import { RECT_CATEGORY } from './collision-categories.js';

export default class Rect {
  static create(x,y,side,life){
    const graphic = new PIXI.Graphics();
    const x_pos = -side/2;
    const y_pos = -side/2;
    const shape = new PIXI.Rectangle(x_pos,y_pos, side, side);
    graphic.beginFill(0xFFFFFF);
    graphic.drawShape(shape);
    const text = new PIXI.Text(life.toString(), {fontFamily : 'Arial', fontSize: side/2, fill : 0x000000, align : 'center'});
    text.x = 0;
    text.y = -side/4;
    graphic.addChild(text);

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
    body.renderable = true;
    body.graphic = graphic;
    body.update = () => {
      graphic.x = body.position.x
      graphic.y = body.position.y
      text.text = body.life.toString();
    }
    body.update();
    return body;  
  }
}
