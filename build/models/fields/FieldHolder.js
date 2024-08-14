"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldHolder = void 0;
class FieldHolder {
    constructor(fieldName, start = 0, length = -1) {
        this.fieldName = fieldName;
        this.start = start;
        this.length = length;
    }
}
exports.FieldHolder = FieldHolder;
