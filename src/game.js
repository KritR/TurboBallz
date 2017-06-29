"use strict";
import { Engine , World , Events, Vector, Composite, Body, Bodies } from 'matter-js';
import Matter from 'matter-js';
import Ball from './ball.js';
import Rect from './rect.js';
import Launcher from './launcher.js';
import MatterCollisionEvents from 'matter-collision-events';

Matter.use('matter-collision-events');

const GameState = Object.freeze({
  LAUNCH: 1,
  PLAYING: 2,
  NEW_LEVEL: 3
}); 

class Game {
  constructor(canvas){
    this.canvas = canvas;
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.rectSide = canvas.clientWidth / 8;
    this.rectGap = this.rectSide / 8;
    this.ballRadius = this.rectSide * 3/16;
    this.ballVelocity = this.ballRadius * 0.8;
    this.engine.world.bounds.max.x = canvas.clientWidth;
    this.engine.world.bounds.max.y = canvas.clientHeight;
    this.world.gravity.y = 0
    Engine.run(this.engine);
    this.scene = new PIXI.Application(canvas.clientWidth, canvas.clientHeight, {view: canvas});
    this.createWalls();
    this.level = 1;
    this.ballCount = 30;
    this.pointerDown = false;
    this.pointerStartPos = Vector.create(0,0);
    this.registerPointerListener();
    this.graphic = new PIXI.Graphics();
    this.launchers = [];
    this.addLauncher(canvas.clientWidth/2);
    this.scene.stage.addChild(this.graphic);
    this.generateLevel();
    this.launch();
    this.scene.ticker.add(this.renderLoop.bind(this));
  }
  pause(){
    this.scene.ticker.stop();
    this.engine.timing.timeScale = 0;
  }
  resume(){
    this.engine.timing.timeScale = 1;
    this.scene.ticker.start();
  }
  launch(){
    this.state = GameState.LAUNCH;
    this.launchers[0].activate();
  }
  playing(){
    this.state = GameState.PLAYING;
  }
  newLevel(){
    this.state = GameState.NEW_LEVEL;
    this.level++;
    this.removeLauncher();
    this.shiftLevels();
    this.generateLevel();
    this.launch();
  }

  createWalls(){
    const vCenter = this.canvas.clientHeight/2;
    const hCenter = this.canvas.clientWidth/2;
    const leftWall = Bodies.rectangle(-1,vCenter,1,this.canvas.clientHeight, {isStatic: true});
    const rightWall = Bodies.rectangle(this.canvas.clientWidth,vCenter,1,this.canvas.clientHeight, {isStatic: true});
    const ceil = Bodies.rectangle(hCenter,-1,this.canvas.clientWidth,1, {isStatic: true});
    const ground = Bodies.rectangle(hCenter,this.canvas.clientHeight,this.canvas.clientWidth,1, {isStatic: true});
    ground.onCollide(pair => {
      const otherBody = pair.bodyA != ground ? pair.bodyA : pair.bodyB;
      if( otherBody.isBall ){
        if(this.launchers.length == 1) {
          this.addLauncher(otherBody.position.x);
        }
        World.remove(this.world, otherBody);
      } /* else if ( otherBody.isRect ){
        alert("Game Over");
      } */ // Doesn't work yet due to matterjs bug
    });
    World.add(this.world, [leftWall, rightWall, ceil, ground]);
  }
  generateLevel(){
    const y = 1.5 * this.rectSide + this.rectGap;
    for(let i = 0; i < 7; i++){
      if(Math.floor(Math.random()*3) > 0){
       continue;
      }
      const x = this.rectGap + 0.5 * this.rectSide + ( i * (this.rectGap + this.rectSide));
      const life = Math.ceil(this.level * 2 * Math.random());
      const rect = Rect.create(x,y,this.rectSide,life); 
      rect.onCollideEnd( pair => {
        rect.life--;
        if(rect.life < 1){
          //rect.text.destroy();
          World.remove(this.world,rect);
        }
      });
      World.add(this.world,rect);
    }
  }
  shiftLevels(){
    for(const body of Composite.allBodies(this.world)){
      if(body.isRect == true){
        Body.translate(body, Vector.create(0,(this.rectGap + this.rectSide)));
        if(body.position.y >= (this.canvas.clientHeight - ((2 * this.ballRadius) + this.rectSide/2))){
          alert('game over');
        }
      }
    }
  }
  addLauncher(x,y = this.canvas.clientHeight - this.ballRadius){
    const launcher = new Launcher(x,y,this.ballRadius, this.ballCount);
    this.launchers.push(launcher);
    this.scene.stage.addChild(launcher.graphic);
  }
  removeLauncher(){
    const launcher = this.launchers.shift();
    this.scene.stage.removeChild(launcher.graphic);
  }

  registerPointerListener(){
    /* ON SCREEN RELEASE WHEN LAUNCH + MIN VECTOR
     * GET EVENT DATA
     * LAUNCH BALLS
     * PLAYING STATE
     */
    document.getElementById("game").addEventListener("pointerdown", e => {
      if(this.state == GameState.LAUNCH){
        this.pointerDown = true;
        this.pointerStartPos = Vector.create(e.pageX, e.pageY);
      }
    });
    document.addEventListener("pointerup", e => {
      this.pointerDown = false;
      if(this.launchers[0].isLaunchable() && this.state == GameState.LAUNCH){
        this.playing();
      }
    });
    document.addEventListener("pointerleave", e => {
      this.pointerDown = false;
    });
    document.addEventListener("pointermove", e => {
      if(!this.pointerDown || this.state != GameState.LAUNCH){
        return;
      }
      const dragVector = Vector.neg(Vector.sub(Vector.create(e.pageX, e.pageY),this.pointerStartPos));
      this.launchers[0].updateVector(dragVector);
    });
  }

  shootBall(){
    const launcher = this.launchers[0];
    const x = launcher.shape.x;
    const y = launcher.shape.y;
    const ball = Ball.create(x,y,this.ballRadius);
    const launchVec = Vector.normalise(launcher.vector);
    World.add(this.world, ball);
    Body.setVelocity(ball, Vector.mult(launchVec, this.ballVelocity)); 
  }  

  renderLoop(delta){
    // RENDER RECTANGLES
    // RENDER BALLS
    this.graphic.clear();
    this.graphic.beginFill(0xFFFFFF);
    
    let ballsRemaining = (this.launchers[0].ballCount > 0);
    for( const body of Composite.allBodies(this.world) ){
      if(body.visible) {
        body.drawGraphic(this.graphic);
      }

      if(this.state == GameState.PLAYING){
        if(body.isBall == true){
          ballsRemaining = true;
        }
      }
    }

    if(!ballsRemaining && this.state == GameState.PLAYING){
      this.newLevel();
    }
    
    // RENDER LAUNCHER
    for(const launcher of this.launchers){
      launcher.render(this.pointerDown && this.state == GameState.LAUNCH);
    }

    // SHOOT BALLS
    if(this.state == GameState.PLAYING){
      if(this.launchers[0].readyToShoot(5)){
        this.launchers[0].shootBall();
        this.shootBall();
      }else{
        this.launchers[0].addTime(delta);
      }
    }

  }
}

export {GameState, Game};
