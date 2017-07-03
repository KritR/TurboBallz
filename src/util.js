/* @flow */
'use strict';

export function toDegrees(radian: number) : number {
  return radian * (180 / Math.PI);
}

export function toRadians(degrees: number) : number {
  return degrees * (Math.PI / 180);
}

export function randomIntFromInterval(min: number, max: number) : number {
    return Math.floor(Math.random()*(max-min+1)+min);
}

export function shuffleArray<T>(array: Array<T>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
