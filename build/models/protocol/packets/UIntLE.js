"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIntLE = void 0;
const PacketLengthModel_1 = require("./PacketLengthModel");
class UIntLE extends PacketLengthModel_1.PacketLengthModel {
    constructor(length, options) {
        super();
        this.length = length;
        this.options = options;
    }
    read(rcvMsgBuf, start = 0) {
        const rcvLength = rcvMsgBuf.readUIntLE(start, this.length);
        return this.getReadLength(rcvLength);
    }
    write(toSndMsgBuf, packetLength, start = 0) {
        toSndMsgBuf.writeUIntLE(this.getLengthToWrite(packetLength), start, this.length);
    }
}
exports.UIntLE = UIntLE;
