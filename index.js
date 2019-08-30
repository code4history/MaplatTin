'use strict';

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

console.log(sprintf('Hello %s', 'World'))

export default BusinessMember
