/* @flow */
"use strict";
import pep from 'pepjs';
import Inferno from 'inferno';
import { createBrowserHistory } from 'history';
import { Provider } from 'inferno-redux';
import { createStore } from 'redux';
import {Router, Route, IndexRoute} from 'inferno-router';
import StartScreen from './components/start-screen.jsx';
import GameScreen from './components/game-screen.jsx';
import GameOver from './components/game-over.jsx';
import reducers from './reducers.js';

const app = document.getElementById('app');
const history = createBrowserHistory();
const store = createStore(reducers);


store.subscribe(()=>{
  localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <IndexRoute component={StartScreen}/>
      <Route path="game" component={GameScreen}/>
      <Route path="gameOver" component={GameOver}/>
    </Router>
  </Provider>
);

Inferno.render(<App/>, app);

export { store };
