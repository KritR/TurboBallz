'use strict';

export function toDegrees(radian){
  return radian * (180 / Math.PI);
}

export function toRadians(degrees){
  return degrees * (Math.PI / 180);
}
