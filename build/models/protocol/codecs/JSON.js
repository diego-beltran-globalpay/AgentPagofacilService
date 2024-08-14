"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Json = void 0;
const FormatterModel_1 = require("./FormatterModel");
class Json extends FormatterModel_1.FormatterModel {
    constructor() {
        super(...arguments);
        this.bufferDecode = (input, encoding) => JSON.parse(input.toString(encoding));
    }
    encode(message) {
        const { body, messageID } = message;
        const messageEncoded = JSON.stringify(body);
        this.logger.trace(`[ JSON ][ Encode ] - Encoded message: [${messageEncoded}]`, { messageID });
        return Buffer.from(messageEncoded, "utf8");
    }
}
exports.Json = Json;
