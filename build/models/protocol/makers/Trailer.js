"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trailer = void 0;
class Trailer {
    constructor(value) {
        this.value = value;
    }
    get length() {
        return this.value.length;
    }
}
exports.Trailer = Trailer;
