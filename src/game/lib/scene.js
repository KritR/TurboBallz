/* @flow */
"use strict";

// TODO: IF USEFUL > ADD EVENT TRIGGERS FOR VARIOUS EVENTS
import { Engine, World, Events } from 'matter-js';
import { Application } from 'pixi.js';
import Entity from './entity.js';

export default class Scene {
  engine: Engine = Engine.create();
  world: World = this.engine.world;
  display: Application;
  entities: Array<Entity> = [];
  width: number;
  height: number;

  constructor(width: number, height: number){
    this.width = width;
    this.height = height;
    this.world.bounds.max.x = Infinity;
    this.world.bounds.min.x = -Infinity;
    this.world.bounds.max.y = Infinity;
    this.world.bounds.min.y = -Infinity;
    this.display = new Application(width, height, {antialias: true, resolution: window.devicePixelRatio});
    this.display.ticker.add(this.render.bind(this));
  }

  pause(){
    this.display.ticker.stop();
  }

  resume(){
    this.display.ticker.start();
  }

  addEntity(...entities: Array<Entity>){
    for(const entity of [].concat(entities)){
      entity.update();
      this.entities.push(entity);
      if(entity.body != null) {
        World.add(this.world, entity.body);
      }
      if(entity.graphic != null) {
        this.display.stage.addChild(entity.graphic);
      }
    }
  }

  removeEntity(...entities: Array<Entity>){
    for(const entity of [].concat(entities)){
      const index = this.entities.indexOf(entity);
      if(index != -1){
        this.entities.splice(index,1);
      }
      if(entity.body != null) {
        World.remove(this.world, entity.body);
      }
      if(entity.graphic != null) {
        this.display.stage.removeChild(entity.graphic);
      }
    }
  }

  render(delta: number){
    Engine.update(this.engine, delta * ( 1000/60 ));
    for( const entity of this.entities ){
      if(entity.destroyed){
        this.removeEntity(entity);
      }
      entity.update();
    }
  }
}
