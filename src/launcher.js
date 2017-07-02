"use strict";
import {Vector} from 'matter-js';
import Ball from './ball.js';
import {toDegrees} from './util.js';

// Launch angle in Degrees
const MIN_LAUNCH_ANGLE = 3;  
export default class Launcher {
  constructor(x,y,radius, ballCount = 1){
    this.graphic = new PIXI.Graphics();
    this.x = x;
    this.y = y;
    this.graphic.x = x;
    this.graphic.y = y;
    this.active = false;
    this.radius = radius;
    const shape = new PIXI.Circle(0, 0, radius);
    this.graphic.beginFill(0xFF3300);
    this.graphic.drawShape(shape);
    this.text = new PIXI.Text(ballCount.toString() + 'x', {fontFamily : 'Arial', fontSize: radius * 1.75, fill : 0xFFFFFF, align : 'center'});
    this.text.x = -radius * 4;
    this.text.y = -radius * 3;
    this.launchGraphic = new PIXI.Graphics();
    this.graphic.addChild(this.launchGraphic);
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
    this.active = true;
    this.graphic.addChild(this.text);
  }
  deactivate(){
    this.active = false;
  }
  readyToShoot(minTime){
    return (this.time > minTime) && (this.ballCount > 0);
  }
  shootBall(){
    this.ballCount -= 1;
    if(this.ballCount < 1) {
      this.graphic.clear();
      this.graphic.removeChild(this.text);
    }
    this.time = 0;
  }
  addTime(delta){
    this.time += delta;
  }
  render(targeting){
    this.launchGraphic.clear();
    if(this.ballCount < 1 || !this.active){
      return;
    }
    this.text.text = this.ballCount.toString() + 'x';
    if(targeting && this.isLaunchable()){
      const BALL_SPACE = this.radius * 3.5;
      for(let i = 1; i< 15; i++){
        const pos = Vector.mult(Vector.normalise(this.vector),i * BALL_SPACE); 
        const size = Math.min(this.radius * 0.8, Vector.magnitude(this.vector) * 0.25);
        const ball = new PIXI.Circle(pos.x, pos.y, size); 
        this.launchGraphic.beginFill(0xFFFFFF);
        this.launchGraphic.drawShape(ball);
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
