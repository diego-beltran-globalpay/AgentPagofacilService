"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
class Header {
    constructor(value) {
        this.value = value;
    }
    get length() {
        return this.value.length;
    }
}
exports.Header = Header;
