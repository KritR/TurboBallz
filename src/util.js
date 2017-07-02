'use strict';

export function toDegrees(radian) {
  return radian * (180 / Math.PI);
}

export function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

export function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
