"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delimiter = void 0;
const PacketLengthModel_1 = require("./PacketLengthModel");
class Delimiter extends PacketLengthModel_1.PacketLengthModel {
    constructor(length, options) {
        super();
        this.length = length;
        this.options = options;
        this.length = 0;
        if (!this.options.delimiter.length)
            throw new Error("The delimiter must have a value. It cannot be empty");
    }
    read(rcvMsgBuf, start = 0) {
        return rcvMsgBuf.indexOf(this.options.delimiter, start);
    }
    write(toSndMsgBuf, packetLength, start = 0) {
        return;
    }
}
exports.Delimiter = Delimiter;
