"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XML = void 0;
const FormatterModel_1 = require("./FormatterModel");
class XML extends FormatterModel_1.FormatterModel {
    constructor() {
        super(...arguments);
        this.bufferDecode = (input, encoding) => ({});
    }
    encode(message) {
        return Buffer.alloc(0);
    }
}
exports.XML = XML;
