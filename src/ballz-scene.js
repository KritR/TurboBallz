/* @flow */
"use strict";

import { Event, Vector, Body, Bodies } from 'matter-js';
import Scene from './scene.js';
import Ball from './ball.js';
import Rect from './rect.js';
import Launcher from './launcher.js';
import OnePlus from './one-plus.js';
import Entity from './entity.js';
import { randomIntFromInterval, shuffleArray } from './util.js';

const SceneState = Object.freeze({
  LAUNCH: 1,
  PLAYING: 2,
  NEW_LEVEL: 3
});

export default class BallzScene extends Scene {

  launchers: Array<Launcher> = [];

  level: number = 0;
  state: number;
  ballCount: number = 1;

  rectSide: number;
  rectGap: number;
  ballRadius: number;
  ballVelocity: number;
  launcherY: number;

  pointerDown: boolean = false;
  pointerStartPos: Vector = Vector.create(0,0);

  constructor(canvas: HTMLCanvasElement){
    super(canvas);
    this.rectSide = canvas.clientWidth / 8;
    this.rectGap = this.rectSide / 8;
    this.ballRadius = this.rectSide * 1/8;
    this.ballVelocity = this.ballRadius * 1.0;
    this.launcherY = this.canvas.clientHeight - this.ballRadius;
    this.world.gravity.y = this.ballRadius * 0.0002;
    this.registerPointerListener();
    this.createWalls();
    this.display.ticker.add(this.update.bind(this));
    this.addLauncher(canvas.clientWidth/2);
    this.newLevel();
  }

  playing() {
    this.state = SceneState.PLAYING;
  }

  launching() {
    this.state = SceneState.LAUNCH;
    this.launchers[0].showText();
    this.launchers[0].ballCount = this.ballCount;
  }

  newLevel() {
    this.state = SceneState.NEW_LEVEL;
    this.level++;
    if(this.launchers.length > 1){
      this.removeLauncher();
    }
    this.shiftLevels();
    const level = this.generateLevel();
    this.addLevel(level);
    this.launching();
  }


  createWalls(){
    const vCenter = this.canvas.clientHeight/2;
    const hCenter = this.canvas.clientWidth/2;
    const leftWall = new Entity(Bodies.rectangle(-1,vCenter,1,this.canvas.clientHeight, {isStatic: true}), null);;
    const rightWall = new Entity(Bodies.rectangle(this.canvas.clientWidth,vCenter,1,this.canvas.clientHeight, {isStatic: true}),null);
    const ceil = new Entity(Bodies.rectangle(hCenter,-1,this.canvas.clientWidth,1, {isStatic: true}), null);
    const ground = new Entity(Bodies.rectangle(hCenter,this.canvas.clientHeight,this.canvas.clientWidth,1, {isStatic: true}),null);
    if( ground.body != null ) {
      ground.body.onCollide(pair => {
        const otherBody = pair.bodyA != ground.body ? pair.bodyA : pair.bodyB;
        if( otherBody.entity instanceof Ball ){
          if(this.launchers.length == 1) {
            this.addLauncher(otherBody.position.x);
          }
          this.removeEntity(otherBody.entity);
        } /* else if ( otherBody.isRect ){
          alert("Game Over");
        } */ // Doesn't work yet due to matterjs bug
      });
    }
    this.addEntity(leftWall, rightWall, ceil, ground);
  }

  generateLevel(){
    const level = new Array(7);
    level[0] = this.generateRect();
    for(let i = 0; i < level.length ; i++){
      if(randomIntFromInterval(1,3) >= 2){
       continue;
      }
      level[i] = this.generateRect();
    }
    if(this.shouldAddOnePlus()){
      const position = randomIntFromInterval(0,level.length -1);
      level[position] = this.generateOnePlus();;
    }
    shuffleArray(level);
    return level;
  }
  
  addLevel(level: Array<Entity>){
    const y = 1.5 * this.rectSide + this.rectGap;
    for(let i = 0; i < level.length ; i++) {
      if(level[i] == null) {
        continue;
      }
      const x = this.rectGap + 0.5 * this.rectSide + ( i * (this.rectGap + this.rectSide));
      Body.setPosition(level[i].body,Vector.create(x,y));
    }
    for(const body of level) {
      if(body == null) {
        continue;
      }
      this.addEntity(body);
    }
  }

  generateOnePlus(){
    const onePlus = new OnePlus(0,0,this.rectSide*0.3);
    onePlus.body.onCollide( pair => {
      this.removeEntity(onePlus);
      this.ballCount++;
    });
    return onePlus;
  }

  shouldAddOnePlus(){
    const difference = this.level - this.ballCount; 
    const odds = 3;
    const shouldAdd = (difference * randomIntFromInterval(1,odds)) > odds;
    return shouldAdd;
  }

  generateRect(){
    const life = randomIntFromInterval(this.level, this.level * 2);
    const rect = new Rect(0,0,this.rectSide,life); 
    return rect;
  }

  addLauncher(x: number, y: number = this.launcherY){
    console.log('placing launcher at ' + y);
    const launcher = new Launcher(x,y,this.ballRadius, this.ballCount);
    this.launchers.push(launcher);
    this.addEntity(launcher);
  }

  shiftLevels(){
    for(const entity of this.entities){
      if(entity instanceof Rect || entity instanceof OnePlus){
        Body.translate(entity.body, Vector.create(0,(this.rectGap + this.rectSide)));
        if(entity.body.position.y >= (this.launcherY - ((2 * this.ballRadius) + this.rectSide/2))){
          alert('game over');
        }
      }
    }
  }

  removeLauncher(){
    const launcher = this.launchers.shift();
    this.removeEntity(launcher);
  }

  shootBall(){
    const launcher = this.launchers[0];
    const x = launcher.position.x;
    const y = launcher.position.y;
    const ball = new Ball(x,y,this.ballRadius, this.ballVelocity, launcher.vector);
    this.addEntity(ball);
  } 

  registerPointerListener(){
   // Events are type < any > until flow stops giving me errors for it 
    this.canvas.addEventListener("pointerdown", (e: any) => {
      if (this.state == SceneState.LAUNCH){
        this.pointerDown = true;
        this.launchers[0].activate();
        this.pointerStartPos = Vector.create(e.pageX, e.pageY);
      }
    });
    document.addEventListener("pointerup", (e: any) => {
      this.pointerDown = false;
      this.launchers[0].deactivate();
      if(this.launchers[0].isLaunchable() && this.state == SceneState.LAUNCH){
        this.playing();
      }
    });
    document.addEventListener("pointerleave", (e: any) => {
      this.pointerDown = false;
    });
    document.addEventListener("pointermove", (e: any) => {
      if(!this.pointerDown || this.state != SceneState.LAUNCH){
        return;
      }
      const dragVector = Vector.neg(Vector.sub(Vector.create(e.pageX, e.pageY),this.pointerStartPos));
      this.launchers[0].updateVector(dragVector);
    });
  }

  update(delta: number){
    if(this.state == SceneState.PLAYING && (this.launchers[0].ballCount < 1)) {
      const ballCount = this.entities.filter( entity => { return entity instanceof Ball } ).length;
      if(ballCount == 0){
        this.newLevel();
      }
    }
    if(this.state == SceneState.PLAYING) {
      if(this.launchers[0].shoot(delta,5)){
        this.shootBall();
      }
    }
  }

}
