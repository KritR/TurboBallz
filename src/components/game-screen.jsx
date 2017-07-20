/* @flow */
import Inferno from 'inferno';
import MenuBar from './menu-bar.jsx';
import ElementWrapper from './element-wrapper.jsx';
import BallzScene from '../game/ballz-scene.js';
import { Events } from 'matter-js';
import { setLevel } from '../actions.js';
import { store } from '../app.jsx';

const onClick = () => {
  alert('hi');
}

let game = new BallzScene(gameDimensions().width, gameDimensions().height);

Events.on(game, 'levelSet', e => {
  store.dispatch(setLevel(e.level));
});

Events.on(game, 'gameOver', e => {
  // GAME OVER SEQUENCE ?
  game = new BallzScene(gameDimensions().width, gameDimensions().height);
  store.dispatch(setLevel(1));
  // REDIRECT TO OTHER SCREEN
});

/*store.subscribe( state => {
  if(state.gamePaused) {
    game.pause();
  } else {
    game.resume();
  }
});*/

const GameScreen = () => {
  return (
    <div class="gameScreen fullView">
      <MenuBar level={0} onClick={onClick}/>
      <ElementWrapper el={game.display.view}/>
    </div>
  );
};

function gameDimensions() {
  const fullWidth: number = window.innerWidth;
  const fullHeight: number = window.innerHeight - 40;
  const defaultRatio = 4/3;
  let width = fullWidth;
  let height = fullHeight;
  if((width * defaultRatio ) > height) {
    width = height / defaultRatio; 
  }
  height = (fullWidth/8) * Math.min(Math.floor(fullHeight / (fullWidth/8)), 10);
  return { width: width, height: height };
}

export default GameScreen;
