/* @flow */
import { combineReducers } from 'redux';
import { SET_LEVEL } from './actions.js';

const initialState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : { level: 1, levelHigh: 1 }

const gameReducer = (state = initialState, action) => {
  switch ( action.type ) {
    case SET_LEVEL:
      return {...state, 
        level: action.level, 
        levelHigh: Math.max(state.levelHigh, action.level)
      }
    default:
      return state;
  }
}

const reducers = combineReducers({gameReducer});

export default reducers;
