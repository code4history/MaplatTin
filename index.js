'use strict';

import { polygon, featureCollection, point, lineString } from '@turf/helpers';
import union from '@turf/union';
import convex from '@turf/convex';
import difference from '@turf/difference';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import centroid from '@turf/centroid';
import lineIntersect from '@turf/line-intersect';
import intersect from '@turf/intersect';

import BusinessMember from './lib/BusinessMember';
import sprintf from './legacy/sprintf';
import Swiper from './legacy/swiper';

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

booleanPointInPolygon();
Object.assign([1, 2, 3], [4, 5, 6]);