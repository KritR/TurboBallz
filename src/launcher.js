"use strict";
import {Vector} from 'matter-js';
import Ball from './ball.js';

const BALL_SPACE = 12;
export default class Launcher {
  constructor(x,y,ballCount = 1){
    this.graphic = new PIXI.Graphics();
    this.graphic.x = x;
    this.graphic.y = y;
    this.active = false;
    this.shape = (new Ball(x,y)).getRenderBody();
  }
  updateVector(vec){
    this.vector = vec;
  }
  activate(){
    this.active = true
  }
  deactivate(){
    this.active = false;
  }
  render(targeting){
    this.graphic.clear();
    this.graphic.beginFill(0xFF3300);
    this.graphic.drawShape(this.shape);
    if(this.active && this.vector != undefined && targeting){
      const angle = Vector.angle(this.vector, Vector.create(0,0));
      console.log(angle);
      if(angle > Math.PI / 12){
        console.log('totally rad');
        for(let i = 1; i< 15; i++){
          const pos = Vector.mult(Vector.normalise(this.vector),i * BALL_SPACE); 
          this.graphic.drawCircle(pos.x,pos.y,2);
        }
      }
    }
  }
}
