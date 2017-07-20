/* @flow */

export const SET_LEVEL = 'SET_LEVEL';

// QUIZLET ACTIONS FOR LATER
/*
 * const SET_QUIZ = 'SET QUIZ';
 * const SET_QUESTIONS = 'SET_QUESTIONS';
 * const ADD_INCORRECT_ANSWER = 'ADD_INCORRECT_ANSWER';
 * const ADD_CORRECT_ANSWER = 'ADD_CORRECT_ANSWER';
 *
 */

export const setLevel = ( level: number ) => {
  return { type: SET_LEVEL, level: level};
};
