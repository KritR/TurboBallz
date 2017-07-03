"use strict";
/* @flow */
import pep from 'pepjs';
import BallzScene from './ballz-scene.js';
import Matter from 'matter-js';
import MatterCollisionEvents from 'matter-collision-events';

Matter.use('matter-collision-events');

export default class Application {
  game: BallzScene
  constructor(){
    const canvas : HTMLCanvasElement = (document.getElementsByTagName('canvas')[0]: HTMLCanvasElement);
    if(canvas != null) {
      this.game = new BallzScene(canvas);
    }
  }
}

export const app = new Application();

