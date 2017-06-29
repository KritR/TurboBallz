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
    body.shape = new PIXI.Rectangle(x,y, side, side);
//    body.text = new PIXI.Text(body.life.toString(), {fontFamily : 'Arial', fontSize: body.side/2, fill : 0x000000, align : 'center'});
    body.drawGraphic = graphic => {
      const x_pos = body.position.x - body.side/2;
      const y_pos = body.position.y - body.side/2;
//      body.text.x = x;
//      body.text.y = y - (body.side/4);
      body.shape.x = x_pos;
      body.shape.y = y_pos;
      graphic.drawShape(body.shape);
//      graphic.addChild(body.text);
    }
    return body;  
  }
}
