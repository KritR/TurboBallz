"use strict";
import {Vector} from 'matter-js';
import Ball from './ball.js';
import {toDegrees} from './util.js';

// Launch angle in Degrees
const MIN_LAUNCH_ANGLE = 3;  
export default class Launcher {
  constructor(x,y,radius, ballCount = 1){
    this.graphic = new PIXI.Graphics();
    this.active = false;
    this.radius = radius;
    this.shape = new PIXI.Circle(x, y, radius);
    this.ballCount = ballCount;
    this.time = Infinity;
  }
  updateVector(vec){
    this.vector = vec;
  }
  getAngle(){
    return Vector.angle(this.vector, Vector.create(0,0));
  }
  activate(){
    this.active = true
  }
  deactivate(){
    this.active = false;
  }
  readyToShoot(minTime){
    return (this.time > minTime) && (this.ballCount > 0);
  }
  shootBall(){
    this.ballCount -= 1;
    this.time = 0;
  }
  addTime(delta){
    this.time += delta;
  }
  render(targeting){
    this.graphic.clear();
    if(this.ballCount < 1){
      return;
    }
    this.graphic.beginFill(0xFF3300);
    this.graphic.drawShape(this.shape);
    if(this.active && targeting && this.isLaunchable()){
      const BALL_SPACE = this.radius * 3.5;
      for(let i = 1; i< 15; i++){
        const pos = Vector.add(Vector.mult(Vector.normalise(this.vector),i * BALL_SPACE), {x: this.shape.x, y: this.shape.y}) ; 
        this.graphic.beginFill(0xFFFFFF);
        //const ball = (new Ball(pos.x,pos.y));
        const ball = new PIXI.Circle(pos.x, pos.y, this.radius); 
        this.graphic.drawShape(ball);
      }
    }
  }
  isLaunchable(){
      if(this.vector == undefined){
        return false;
      }
      const angle = toDegrees(Vector.angle(this.vector, Vector.create(0,0)));
      return (angle > MIN_LAUNCH_ANGLE) && (angle < (180 - MIN_LAUNCH_ANGLE));
  }
}
