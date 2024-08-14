"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const FormatterModel_1 = require("./FormatterModel");
class Text extends FormatterModel_1.FormatterModel {
    constructor() {
        super(...arguments);
        this.bufferDecode = (input) => ({
            PlainText: input.toString("utf-8"),
        });
    }
    encode(message) {
        const { body, messageID } = message;
        const messageEncoded = body.PlainText;
        this.logger.trace(`[ Text ][ Encode ] - Encoded message: [${messageEncoded}]`, { messageID });
        return Buffer.from(messageEncoded, "utf8");
    }
}
exports.Text = Text;
