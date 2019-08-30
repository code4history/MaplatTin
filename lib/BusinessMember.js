'use strict';

import Member from './Member';

export default class BusinessMember extends Member{
    constructor(firstName, lastName, company) {
        super(firstName, lastName);  // 親クラスのコンストラクタは、コンストラクタの1行目で記載する必要がある
        this.company = company;
    }

    get company() {
        return this._company;
    }

    set company(value) {
        this._company = value;
    }

    getName() {
        return this.lastName + ' ' + this.firstName + '/' + this.company;
    }
}
