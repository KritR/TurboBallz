"use strict";

import pep from 'pepjs';
import PIXI from 'pixi.js';
import {Game} from './game.js';
import Color from 'color';

export default class Application {
  constructor(){
    this.game = new Game(document.getElementById('game'));
  }
}

export const app = new Application();

