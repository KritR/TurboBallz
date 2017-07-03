/* @flow */
"use strict";
import {Vector} from 'matter-js';
import Ball from './ball.js';
import {toDegrees} from './util.js';
import Entity from './entity.js';
import { Graphics, Circle, Text } from 'pixi.js';

// Launch angle in Degrees
const MIN_LAUNCH_ANGLE = 4;  
export default class Launcher extends Entity {
  graphic: Graphics;
  active: boolean = false;
  radius: number;
  text: Text;
  launchGraphic: Graphics;
  ballCount: number;
  time: number;
  vector: Vector;
  position: Vector; 

  constructor(x: number, y: number, radius: number, ballCount: number = 1){
    const graphic = new Graphics();
    const shape = new Circle(0, 0, radius);
    graphic.x = x;
    graphic.y = y;
    graphic.beginFill(0xFF3300);
    graphic.drawShape(shape);
    super(null, graphic);
    this.position = Vector.create(x,y);
    this.radius = radius;
    this.text = new Text(ballCount.toString() + 'x', {fontFamily : 'Arial', fontSize: radius * 1.75, fill : 0xFFFFFF, align : 'center'});
    this.text.x = -radius * 4;
    this.text.y = -radius * 3;
    this.launchGraphic = new Graphics();
    this.graphic.addChild(this.launchGraphic);
    this.ballCount = ballCount;
    this.time = Infinity;
  }
  updateVector(vec: Vector){
    this.vector = vec;
  }
  getAngle(){
    return Vector.angle(this.vector, Vector.create(0,0));
  }
  showText(){
    this.graphic.addChild(this.text);
  }
  activate(){
    this.active = true;
  }
  deactivate(){
    this.active = false;
  }
  shoot(delta: number, delay: number): boolean{
    this.time += delta;
    if((this.time < delay) || (this.ballCount < 1)){
      return false;
    }
    this.ballCount -= 1;
    if(this.ballCount < 1) {
      this.graphic.clear();
      this.graphic.removeChild(this.text);
    }
    this.time = 0;
    return true;
  }
  update(){
    this.launchGraphic.clear();
    if(this.ballCount < 1 || !this.active){
      return;
    }
    this.text.text = this.ballCount.toString() + 'x';
    if(this.isLaunchable()){
      const BALL_SPACE = this.radius * 3.5;
      for(let i = 1; i< 15; i++){
        const pos = Vector.mult(Vector.normalise(this.vector),i * BALL_SPACE); 
        const size = Math.min(this.radius * 0.8, Vector.magnitude(this.vector) * 0.04);
        const ball = new Circle(pos.x, pos.y, size); 
        this.launchGraphic.beginFill(0xFFFFFF);
        this.launchGraphic.drawShape(ball);
      }
    }
  }
  isLaunchable(): boolean {
      if(this.vector == undefined){
        return false;
      }
      const angle = toDegrees(Vector.angle(this.vector, Vector.create(0,0)));
      return (angle > MIN_LAUNCH_ANGLE) && (angle < (180 - MIN_LAUNCH_ANGLE));
  }
}
