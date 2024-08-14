"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextHex = void 0;
const FormatterModel_1 = require("./FormatterModel");
class TextHex extends FormatterModel_1.FormatterModel {
    constructor() {
        super(...arguments);
        this.bufferDecode = (input) => ({
            PlainText: input.toString("hex"),
        });
    }
    encode(message) {
        const { body, messageID } = message;
        const messageEncoded = body.PlainText;
        this.logger.trace(`[ TextHex ][ Encode ] - Encoded message: [${messageEncoded}]`, { messageID });
        return Buffer.from(messageEncoded, "hex");
    }
}
exports.TextHex = TextHex;
