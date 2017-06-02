"use strict";
import { Engine , World , Events, Vector } from 'matter-js';
import { Ball } from './ball.js';
import { Rect } from './rect.js';
import Launcher from './launcher.js';

const GameState = Object.freeze({
  LAUNCH: 1,
  BREAKING: 2,
  FALLING: 3,
  NEW_LEVEL: 4
}); 

class Game {
  constructor(canvas){
    this.canvas = canvas;
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.rectSide = canvas.clientWidth / 8;
    this.rectGap = this.rectSide / 8;
    this.engine.world.bounds.max.x = canvas.clientWidth;
    this.engine.world.bounds.max.y = canvas.clientHeight;
    this.scene = new PIXI.Application(canvas.clientWidth, canvas.clientHeight, {view: canvas});
    this.level = 0;
    this.pointerDown = false;
    this.pointerStartPos = Vector.create(0,0);
    this.registerCollisionListener();
    this.registerPointerListener();
    this.graphic = new PIXI.Graphics();
    this.graphic.x = 500;
    this.graphic.y = 500;
    this.graphic.clear();
    this.launcher = new Launcher(200,200);
    this.scene.stage.addChild(this.launcher.graphic);
    this.scene.stage.addChild(this.graphic);
    this.newLevel();
    this.scene.ticker.add(this.renderLoop.bind(this));
  }
  pause(){
    this.engine.timing.timeScale = 0;
  }
  resume(){
    this.engine.timing.timeScale = 1;
  }
  launch(){
    console.log("launching");
    this.state = GameState.LAUNCH;
    this.launcher.activate();
  }
  breaking(){
    this.state = GameState.BREAKING;
    // 
  }
  falling(){
    this.state = GameState.FALLING;
    // 
  }
  newLevel(){
    this.state = GameState.NEW_LEVEL;
    this.launch();
    //
  }
  registerCollisionListener(){
    Events.on(this.engine, "collisionEnd", function(event){
    const pairs = event.pairs;
    for( const pair of pairs ){
      // Remove if Out Of Numbers
      }
    });
  }
  registerPointerListener(){
    document.getElementById("game").addEventListener("pointerdown", e => {
      if(this.state == GameState.LAUNCH){
        this.pointerDown = true;
        this.pointerStartPos = Vector.create(e.pageX, e.pageY);
      }
    });
    document.addEventListener("pointerup", e => {
      this.pointerDown = false;

    });
    document.addEventListener("pointerleave", e => {
      this.pointerDown = false;
    });
    document.addEventListener("pointermove", e => {
      if(!this.pointerDown){
        return;
      }
      const dragVector = Vector.neg(Vector.sub(Vector.create(e.pageX, e.pageY),this.pointerStartPos));
      this.launcher.updateVector(dragVector);
    });
  }

  renderLoop(){
    // RENDER LAUNCHER
    this.launcher.render(this.pointerDown && this.state == GameState.LAUNCH);
    // RENDER BALL COUNTER

    // RENDER RECTANGLES
    // RENDER BALLS
  }
  /* ON SCREEN PULL WHEN LAUNCH
   * GET EVENT DATA
   * SCENE RENDER LAUNCHER
   */
   /* ON SCREEN RELEASE WHEN LAUNCH + MIN VECTOR
   * GET EVENT DATA
   * LAUNCH BALLS
   * BREAKING STATE
   */
  /* ON ALL BALLS DEAD
   * FALLING
   */
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
