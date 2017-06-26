"use strict";
import { Engine , World , Events, Vector, Composite, Body } from 'matter-js';
import Matter from 'matter-js';
import Ball from './ball.js';
import Rect from './rect.js';
import Launcher from './launcher.js';
import MatterCollisionEvents from 'matter-collision-events';

Matter.use('matter-collision-events');

const BALL_VELOCITY = 1;
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
    this.engine.world.bounds.max.x = canvas.clientWidth;
    this.engine.world.bounds.max.y = canvas.clientHeight;
    this.world.gravity.y = 0
    Engine.run(this.engine);
    this.scene = new PIXI.Application(canvas.clientWidth, canvas.clientHeight, {view: canvas});
    this.level = 1;
    this.ballCount = 1;
    this.pointerDown = false;
    this.pointerStartPos = Vector.create(0,0);
    this.registerCollisionListener();
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
    console.log('now playing');
    this.state = GameState.PLAYING;
  }
  newLevel(){
    this.state = GameState.NEW_LEVEL;
    this.level++;
    this.removeLauncher();
    this.generateLevel();
    this.shiftLevels();
    this.launch();
  }
  generateLevel(){
    const y = this.rectSide + this.rectGap;
    for(let i = 0; i < 8; i++){
      if(Math.floor(Math.random()*3) > 0){
       continue;
      }
      const x = this.rectGap + ( i * (this.rectGap + this.rectSide));
      const life = Math.ceil(this.level * 2 * Math.random());
      const rect = Rect.create(x,y,this.rectSide,life); 
      rect.onCollideEnd( pair => {
        rect.life--;
        if(rect.life < 1){
          World.remove(this.world,rect);
        }
      });
      World.add(this.world,rect);
    }
  }
  shiftLevels(){
    for(const body in Composite.allBodies(this.world)){
      if(body.isRect == true){
        body.position.y += (this.rectGap + this.rectSide);
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
  registerCollisionListener(){
    Events.on(this.engine, "afterUpdate", function() {
      console.log('goodbye sweet world');
    });
  }
  registerPointerListener(){
    document.getElementById("game").addEventListener("pointerdown", e => {
      if(this.state == GameState.LAUNCH){
        this.pointerDown = true;
        this.pointerStartPos = Vector.create(e.pageX, e.pageY);
      }
    });
    /* ON SCREEN RELEASE WHEN LAUNCH + MIN VECTOR
     * GET EVENT DATA
     * LAUNCH BALLS
     * PLAYING STATE
     */
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
    console.log('Creating new Ball @ x : ' + x + ' | y : ' + y);
    const ball = Ball.create(x,y,this.ballRadius);
    const launchVec = Vector.normalise(launcher.vector);
        ball.onCollide( pair => {
      // Kill Ball on Ground Collision
    });
    World.add(this.world, ball);
    Body.setVelocity(ball, launchVec); 
  }  

  renderLoop(delta){
    // RENDER RECTANGLES
    // RENDER BALLS
    this.graphic.clear();
    this.graphic.beginFill(0xFFFFFF);
    
    let ballsRemaining = (this.launchers[0].ballCount > 0);
    for( const body of Composite.allBodies(this.world) ){
      this.graphic.drawShape(body.getGraphic());

      if(this.state == GameState.PLAYING){
        if(body.isBall == true){
          console.log('body is at ' + body.position.x + ' : ' + body.position.y );
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
      /* ON FALLING ANIMATION DONE
   * NEWLEVEL
   */
   /* GENERATE LEVEL
    * CREATE RECT ARRAY BASED ON SCREEN WIDTH and LEVEL
    */
   /* RENDER LEVEL
    * ADD RECTS TO WORLD
    */
   
}

export {GameState, Game};
