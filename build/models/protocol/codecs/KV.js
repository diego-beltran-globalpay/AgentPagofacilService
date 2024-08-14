"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KV = void 0;
const FormatterModel_1 = require("./FormatterModel");
class KV extends FormatterModel_1.FormatterModel {
    constructor(pairSeparator = "|", keyValueSeparator = "=", isStartSeparator = false, isEndSeperator = false) {
        super();
        this.pairSeparator = pairSeparator;
        this.keyValueSeparator = keyValueSeparator;
        this.isStartSeparator = isStartSeparator;
        this.isEndSeperator = isEndSeperator;
        this.bufferDecode = (input, encoding) => input
            .toString(encoding)
            .split(this.pairSeparator)
            .reduce((result, keyValue) => {
            if (keyValue && keyValue.trim() !== "") {
                const splitSeparatorPosition = keyValue.indexOf(this.keyValueSeparator);
                result[keyValue.substring(0, splitSeparatorPosition)] = keyValue.substring(splitSeparatorPosition + 1);
            }
            return result;
        }, {});
    }
    encode(message) {
        const { body } = message;
        let messageEncoded = "";
        if (!body || Object.keys(body).length == 0)
            return Buffer.alloc(0);
        for (const fieldKey in body) {
            messageEncoded += fieldKey + this.keyValueSeparator + body[fieldKey] + this.pairSeparator;
        }
        if (this.isStartSeparator)
            messageEncoded = this.pairSeparator + messageEncoded;
        if (!this.isEndSeperator)
            messageEncoded = messageEncoded.substr(0, messageEncoded.length - 1);
        return Buffer.from(messageEncoded, "utf8");
    }
}
exports.KV = KV;
