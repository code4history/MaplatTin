'use strict';

import { polygon, featureCollection, point, lineString } from '@turf/helpers';
import union from '@turf/union';
import convex from '@turf/convex';
import difference from '@turf/difference';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import centroid from '@turf/centroid';
import lineIntersect from '@turf/line-intersect';
import intersect from '@turf/intersect';

import BusinessMember from '../lib/BusinessMember';
import sprintf from '../legacy/sprintf';
import Swiper from '../legacy/swiper';

import add from './add';

console.info(add(2, 3));
console.info(['hoge', 'fuga', 'piyo'].includes('piyo'));

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
    console.log('start');
    await wait(2000);
    console.log('end')
})();

let pro = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('ok');
    }, 500)
});

pro.then(response => {
    let user = new BusinessMember('taro', 'yamada', 'G社');
    console.log(user.getName());
});

console.log(sprintf('Hello %s', 'World'));

//booleanPointInPolygon();
console.log(Object.assign({a: 1, b: 2, c:3}, {a: 4, b: 5, d: 6}));

const worker1 = new Worker('dist/worker1.js');
const worker2 = new Worker('dist/worker2.js');

document.getElementById('button1').addEventListener('click', () => {
    worker1.postMessage(5);
});

document.getElementById('button2').addEventListener('click', () => {
    worker2.postMessage(5);
});

worker1.onmessage = (event) => {
    console.log(event.data);
};

worker2.onmessage = (event) => {
    console.log(event.data);
};