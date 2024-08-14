"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.None = void 0;
const PacketLengthModel_1 = require("./PacketLengthModel");
class None extends PacketLengthModel_1.PacketLengthModel {
    constructor(length, options) {
        super();
        this.length = length;
        this.options = options;
    }
    read(rcvMsgBuf, start = 0) {
        return rcvMsgBuf.length;
    }
    write(toSndMsgBuf, packetLength, start = 0) {
        return;
    }
}
exports.None = None;
