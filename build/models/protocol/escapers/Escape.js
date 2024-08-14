"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Escape = void 0;
class Escape {
    constructor(escapeChar) {
        this.escapeChar = escapeChar;
    }
    get length() {
        return this.escapeChar.length;
    }
    escape(source) {
        return source;
    }
    unescape(source) {
        return source;
    }
}
exports.Escape = Escape;
