"use strict";
import {Vector} from 'matter-js';
import Ball from './ball.js';
import {toDegrees} from './util.js';

const BALL_SPACE = 12;
// Launch angle in Degrees
const MIN_LAUNCH_ANGLE = 5;  
export default class Launcher {
  constructor(x,y,ballCount = 1){
    this.graphic = new PIXI.Graphics();
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
    if(this.active && targeting && Launcher.isLaunchable(this.vector)){
      for(let i = 1; i< 15; i++){
        const pos = Vector.add(Vector.mult(Vector.normalise(this.vector),i * BALL_SPACE), {x: this.shape.x, y: this.shape.y}) ; 
        this.graphic.beginFill(0xFFFFFF);
        const ball = (new Ball(pos.x,pos.y));
        this.graphic.drawShape(ball.getRenderBody());
      }
    }
  }
  static isLaunchable(vector){
      if(vector == undefined){
        return false;
      }
      const angle = toDegrees(Vector.angle(vector, Vector.create(0,0)));
      return (angle > MIN_LAUNCH_ANGLE) && (angle < (180 - MIN_LAUNCH_ANGLE));
  }
}
