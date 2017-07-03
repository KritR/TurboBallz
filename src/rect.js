/* @flow */
"use strict";
import { Bodies, Body } from 'matter-js';
import { RECT_CATEGORY } from './collision-categories.js';
import Entity from './entity.js';
import Color from 'color';
import { Graphics, Rectangle, Text } from 'pixi.js';

const TEXT_COLOR = 0x000000;

export default class Rect extends Entity {
  life: number;
  text: Text;
  graphic: Graphics;
  body: Body;
  shape: Rectangle;

  constructor(x: number, y: number, side: number, life: number){
    const graphic = new Graphics();
    const x_pos = -side/2;
    const y_pos = -side/2;
    const text = new Text(life.toString(), {fontFamily : 'Arial', fontSize: side/2, fill : TEXT_COLOR, align : 'center'});
    text.y = -side/4;
    graphic.addChild(text);

    const body = Bodies.rectangle(x, y, side, side, { 
      collisionFilter: {
        category: RECT_CATEGORY
      },
      isStatic: true,
    });

    super(body,graphic);

    this.shape = new Rectangle(x_pos,y_pos, side, side);
    this.life = life;
    this.text = text;

    body.onCollideEnd( pair => {
      if(--this.life < 1) {
        this.destroy();
      }
    });
  }
  update() {
    this.graphic.clear();
    this.graphic.beginFill(this.getColor());
    this.graphic.drawShape(this.shape);
    this.graphic.x = this.body.position.x
    this.graphic.y = this.body.position.y
    this.text.text = this.life.toString();
    this.text.x = -this.text.width/2;
  }
  getColor(): number{
    const color = new Color({
      h: (50 - this.life*3) % 360,
      s: 90,
      l: 55 - Math.ceil(this.life/50)
    });
    return color.rgbNumber();
  }
}
