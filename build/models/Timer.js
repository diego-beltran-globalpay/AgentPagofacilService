"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
class Timer {
    constructor(callback, time) {
        this.callback = callback;
        this.time = time;
        this.cleared = true;
        this.timer = null;
    }
    clear() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.cleared = true;
    }
    set() {
        this.timer = setTimeout(this.callback, this.time);
        this.cleared = false;
    }
}
exports.Timer = Timer;
