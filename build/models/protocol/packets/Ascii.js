"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ascii = void 0;
const PacketLengthModel_1 = require("./PacketLengthModel");
class Ascii extends PacketLengthModel_1.PacketLengthModel {
    constructor(length, options) {
        super();
        this.length = length;
        this.options = options;
    }
    read(rcvMsgBuf, start = 0) {
        const rcvLength = parseInt(rcvMsgBuf.subarray(start).toString().substr(0, this.length));
        return this.getReadLength(rcvLength);
    }
    write(toSndMsgBuf, packetLength, start = 0) {
        const lengthToWrite = this.getLengthToWrite(packetLength).toString();
        let padding = "";
        if (this.length < lengthToWrite.length)
            throw new Error("The packet length is bigger than max value supported to this packet length type");
        for (let i = 0; i < this.length - lengthToWrite.length; i++)
            padding += "0";
        toSndMsgBuf.write(padding + lengthToWrite, start);
    }
}
exports.Ascii = Ascii;
