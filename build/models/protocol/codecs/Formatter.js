"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formatter = void 0;
const FormatterAvb_1 = require("./FormatterAvb");
const Dictc_1 = require("./Dictc");
const JSON_1 = require("./JSON");
const MsgPack_1 = require("./MsgPack");
const XML_1 = require("./XML");
const KV_1 = require("./KV");
const ISO8583_1 = require("./ISO8583");
const Text_1 = require("./Text");
const TextHex_1 = require("./TextHex");
class Formatter {
    static get(type, opts) {
        switch (type) {
            case FormatterAvb_1.FormattersAvb.dictc:
                return new Dictc_1.Dictc();
            case FormatterAvb_1.FormattersAvb.json:
                return new JSON_1.Json();
            case FormatterAvb_1.FormattersAvb.msgpack:
                return new MsgPack_1.MsgPack();
            case FormatterAvb_1.FormattersAvb.xml:
                return new XML_1.XML();
            case FormatterAvb_1.FormattersAvb.textHex:
                return new TextHex_1.TextHex();
            case FormatterAvb_1.FormattersAvb.text:
                return new Text_1.Text();
            case FormatterAvb_1.FormattersAvb.kvp:
                return new KV_1.KV(opts.pairSeparator, opts.keyValueSeparator, opts.isStartSeparator, opts.isEndSeperator);
            case FormatterAvb_1.FormattersAvb.iso8583:
                return new ISO8583_1.ISO8583(opts.configFilePath);
            default:
                throw new Error("Formatter type is not supported");
        }
    }
}
exports.Formatter = Formatter;
