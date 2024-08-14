"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatterModel = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
class FormatterModel {
    constructor() {
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.decode = (message, encoding = "utf-8") => {
            const { rawBody } = message;
            message.body = this.bufferDecode(rawBody, encoding);
            return message;
        };
    }
}
exports.FormatterModel = FormatterModel;
