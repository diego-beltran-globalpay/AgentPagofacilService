"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIntBE = void 0;
const PacketLengthModel_1 = require("./PacketLengthModel");
class UIntBE extends PacketLengthModel_1.PacketLengthModel {
    constructor(length, options) {
        super();
        this.length = length;
        this.options = options;
    }
    read(rcvMsgBuf, start = 0) {
        const rcvLength = rcvMsgBuf.readUIntBE(start, this.length);
        return this.getReadLength(rcvLength);
    }
    write(toSndMsgBuf, packetLength, start = 0) {
        toSndMsgBuf.writeUIntBE(this.getLengthToWrite(packetLength), start, this.length);
    }
}
exports.UIntBE = UIntBE;
