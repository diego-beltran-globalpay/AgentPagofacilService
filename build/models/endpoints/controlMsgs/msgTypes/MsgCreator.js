"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgCreator = void 0;
const LoggersColletion_1 = require("../../../../modules/logger/LoggersColletion");
class MsgCreator {
    constructor() {
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
    }
}
exports.MsgCreator = MsgCreator;
