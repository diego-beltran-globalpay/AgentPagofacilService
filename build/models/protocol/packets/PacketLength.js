"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketLength = void 0;
const PacketLengthModel_1 = require("./PacketLengthModel");
const Ascii_1 = require("./Ascii");
const UIntBE_1 = require("./UIntBE");
const UIntLE_1 = require("./UIntLE");
const None_1 = require("./None");
const Delimiter_1 = require("./Delimiter");
class PacketLength {
    static get(type, length, opts) {
        switch (type) {
            case PacketLengthModel_1.PacketLengthAvb.ascii:
                return new Ascii_1.Ascii(length, opts);
            case PacketLengthModel_1.PacketLengthAvb.uintbe:
                return new UIntBE_1.UIntBE(length, opts);
            case PacketLengthModel_1.PacketLengthAvb.uintle:
                return new UIntLE_1.UIntLE(length, opts);
            case PacketLengthModel_1.PacketLengthAvb.none:
                return new None_1.None(length, opts);
            case PacketLengthModel_1.PacketLengthAvb.delimiter:
                return new Delimiter_1.Delimiter(length, opts);
            default:
                throw new Error("Packet length type is not supported");
        }
    }
}
exports.PacketLength = PacketLength;
