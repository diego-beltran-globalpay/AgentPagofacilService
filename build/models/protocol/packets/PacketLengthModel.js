"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketLengthModel = exports.PacketLengthFormat = exports.PacketLengthAvb = void 0;
var PacketLengthAvb;
(function (PacketLengthAvb) {
    PacketLengthAvb["ascii"] = "ascii";
    PacketLengthAvb["uintbe"] = "uintbe";
    PacketLengthAvb["uintle"] = "uintle";
    PacketLengthAvb["none"] = "none";
    PacketLengthAvb["delimiter"] = "delimiter";
})(PacketLengthAvb = exports.PacketLengthAvb || (exports.PacketLengthAvb = {}));
var PacketLengthFormat;
(function (PacketLengthFormat) {
    PacketLengthFormat["decimal"] = "dec";
    PacketLengthFormat["hexadecimal"] = "hex";
})(PacketLengthFormat = exports.PacketLengthFormat || (exports.PacketLengthFormat = {}));
class PacketLengthModel {
    getLengthToWrite(lengthToWrite) {
        const { packetLengthIncluded } = this.options;
        return lengthToWrite + (packetLengthIncluded ? this.length : 0);
    }
    getReadLength(readLength) {
        const { packetLengthIncluded } = this.options;
        return readLength - (packetLengthIncluded ? this.length : 0);
    }
}
exports.PacketLengthModel = PacketLengthModel;
