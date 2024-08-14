"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgPack = void 0;
const msgpack5_1 = __importDefault(require("msgpack5"));
const FormatterModel_1 = require("./FormatterModel");
const msgPack = msgpack5_1.default();
class MsgPack extends FormatterModel_1.FormatterModel {
    constructor() {
        super(...arguments);
        this.bufferDecode = (input) => msgPack.decode(input);
    }
    encode(message) {
        const { body, messageID } = message;
        const messageEncoded = msgPack.encode(body);
        this.logger.trace(`[ MsgPack ][ Encode ] - Encoded message: [${messageEncoded}]`, { messageID });
        return messageEncoded;
    }
}
exports.MsgPack = MsgPack;
