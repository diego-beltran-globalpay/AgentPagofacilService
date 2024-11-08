"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTargetPropsITF = exports.TargetPropsITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.TargetPropsITFSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    defaultProperties: [],
    definitions: {
        CheckSumAvb: {
            enum: ["crc16", "crc32", "crc8", "lrc", "none"],
            type: "string",
        },
        FormattersAvb: {
            enum: ["dictc", "iso8583", "json", "kvp", "msgpack", "text", "textHex", "xml"],
            type: "string",
        },
        PacketLengthAvb: {
            enum: ["ascii", "delimiter", "none", "uintbe", "uintle"],
            type: "string",
        },
        PacketLengthFormat: {
            enum: ["dec", "hex"],
            type: "string",
        },
        tlsVersionsKey: {
            enum: ["1_2", "1_3"],
            type: "string",
        },
    },
    properties: {
        targetAck: {
            type: "string",
        },
        targetCheckSumLengthIncluded: {
            type: "boolean",
        },
        targetCheckSumType: {
            $ref: "#/definitions/CheckSumAvb",
        },
        targetCrcPoly: {
            type: "number",
        },
        targetCrcReflect: {
            type: "boolean",
        },
        targetCrcXorIn: {
            type: "number",
        },
        targetCrcXorOut: {
            type: "number",
        },
        targetDataType: {
            $ref: "#/definitions/FormattersAvb",
        },
        targetEchoTransformationRuleName: {
            type: "string",
        },
        targetEnableAuthenticator: {
            type: "boolean",
        },
        targetEnableHttps: {
            type: "boolean",
        },
        targetEnableTls: {
            type: "boolean",
        },
        targetEnableWss: {
            type: "boolean",
        },
        targetEnq: {
            type: "string",
        },
        targetEot: {
            type: "string",
        },
        targetEscapeChar: {
            type: "string",
        },
        targetHeader: {
            type: "string",
        },
        targetHeaderLengthIncluded: {
            type: "boolean",
        },
        targetHttpCallerAuthKey: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetHttpCallerAuthRuleName: {
            type: "string",
        },
        targetHttpCallerEnableHttps: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetHttpCallerGroups: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetHttpCallerIp: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetHttpCallerNames: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetHttpCallerPath: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetHttpCallerPort: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetHttpCallerRejectUnauthorized: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetHttpCallerReloadAuth: {
            type: "number",
        },
        targetHttpCallerTimeout: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetHttpListenIp: {
            type: "string",
        },
        targetHttpListenPort: {
            type: "number",
        },
        targetHttpMaxConnections: {
            type: ["null", "number"],
        },
        targetHttpRequestTimeout: {
            type: ["null", "number"],
        },
        targetHttpSocketTimeout: {
            type: ["null", "number"],
        },
        targetHttpsCaPath: {
            type: "string",
        },
        targetHttpsCertPath: {
            type: "string",
        },
        targetHttpsKeyPath: {
            type: "string",
        },
        targetIsHeaderIncludedInCkSum: {
            type: "boolean",
        },
        targetIsTrailerIncludedInCkSum: {
            type: "boolean",
        },
        targetIsoConfigPath: {
            type: "string",
        },
        targetKvIsEndSeparator: {
            type: "boolean",
        },
        targetKvIsStartSeparator: {
            type: "boolean",
        },
        targetKvKeyValueSeparator: {
            type: "string",
        },
        targetKvPairSeparator: {
            type: "string",
        },
        targetListenGroup: {
            type: "string",
        },
        targetLogonTransformationRuleName: {
            type: "string",
        },
        targetNack: {
            type: "string",
        },
        targetPacketLengthFirst: {
            type: "boolean",
        },
        targetPacketLengthFormat: {
            $ref: "#/definitions/PacketLengthFormat",
        },
        targetPacketLengthIncluded: {
            type: "boolean",
        },
        targetPacketLengthLen: {
            enum: [0, 1, 2, 3, 4, 5, 6],
            type: "number",
        },
        targetPacketLengthOffset: {
            type: "number",
        },
        targetPacketLengthType: {
            $ref: "#/definitions/PacketLengthAvb",
        },
        targetSerialCallerAck: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerBaudRate: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetSerialCallerCheckSumLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerCheckSumType: {
            items: {
                enum: ["crc16", "crc32", "crc8", "lrc", "none"],
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerCrcPoly: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetSerialCallerCrcReflect: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerCrcXorIn: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetSerialCallerCrcXorOut: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetSerialCallerDataBits: {
            items: {
                enum: [5, 6, 7, 8],
                type: "number",
            },
            type: "array",
        },
        targetSerialCallerDataType: {
            items: {
                enum: ["dictc", "iso8583", "json", "kvp", "msgpack", "text", "textHex", "xml"],
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerEnq: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerEot: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerEscapeChar: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerGroups: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerHeader: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerHeaderLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerIsHeaderIncludedInCkSum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerIsTrailerIncludedInCkSum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerIsoConfigPath: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerLock: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerNack: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerNames: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerPacketLengthFirst: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerPacketLengthFormat: {
            items: {
                enum: ["dec", "hex"],
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerPacketLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerPacketLengthLen: {
            items: {
                enum: [0, 1, 2, 3, 4, 5, 6],
                type: "number",
            },
            type: "array",
        },
        targetSerialCallerPacketLengthOffset: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetSerialCallerPacketLengthType: {
            items: {
                enum: ["ascii", "delimiter", "none", "uintbe", "uintle"],
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerParity: {
            items: {
                enum: ["even", "mark", "none", "odd", "space"],
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerPort: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerReconnectTime: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetSerialCallerStopBits: {
            items: {
                enum: [1, 2],
                type: "number",
            },
            type: "array",
        },
        targetSerialCallerTimeout: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetSerialCallerTrailer: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetSerialCallerTrailerBeforeCksum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerTrailerLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerXoff: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetSerialCallerXon: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpCallerAck: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerCheckSumLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpCallerCheckSumType: {
            items: {
                enum: ["crc16", "crc32", "crc8", "lrc", "none"],
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerCrcPoly: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetTcpCallerCrcReflect: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpCallerCrcXorIn: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetTcpCallerCrcXorOut: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetTcpCallerDataType: {
            items: {
                enum: ["dictc", "iso8583", "json", "kvp", "msgpack", "text", "textHex", "xml"],
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerEnableTls: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpCallerEnq: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerEot: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerEscapeChar: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerGroups: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerHeader: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerHeaderLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpCallerIp: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerIsHeaderIncludedInCkSum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpCallerIsTrailerIncludedInCkSum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpCallerIsoConfigPath: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerNack: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerNames: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerPacketLengthFirst: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpCallerPacketLengthFormat: {
            items: {
                enum: ["dec", "hex"],
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerPacketLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpCallerPacketLengthLen: {
            items: {
                enum: [0, 1, 2, 3, 4, 5, 6],
                type: "number",
            },
            type: "array",
        },
        targetTcpCallerPacketLengthOffset: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetTcpCallerPacketLengthType: {
            items: {
                enum: ["ascii", "delimiter", "none", "uintbe", "uintle"],
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerPort: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetTcpCallerReconnectTime: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetTcpCallerTimeout: {
            items: {
                type: "number",
            },
            type: "array",
        },
        targetTcpCallerTrailer: {
            items: {
                type: "string",
            },
            type: "array",
        },
        targetTcpCallerTrailerBeforeCksum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpCallerTrailerLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        targetTcpListenIp: {
            type: "string",
        },
        targetTcpListenPort: {
            type: "number",
        },
        targetTcpMaxConnections: {
            type: ["null", "number"],
        },
        targetTcpSocketTimeout: {
            type: ["null", "number"],
        },
        targetTimerEchoTest: {
            type: "number",
        },
        targetTlsCaPath: {
            type: "string",
        },
        targetTlsCertPath: {
            type: "string",
        },
        targetTlsKeyPath: {
            type: "string",
        },
        targetTlsMaxVersion: {
            $ref: "#/definitions/tlsVersionsKey",
        },
        targetTlsMinVersion: {
            $ref: "#/definitions/tlsVersionsKey",
        },
        targetTlsRejectUnauthorized: {
            type: "boolean",
        },
        targetTlsRequestCert: {
            type: "boolean",
        },
        targetTrailer: {
            type: "string",
        },
        targetTrailerBeforeCksum: {
            type: "boolean",
        },
        targetTrailerLengthIncluded: {
            type: "boolean",
        },
        targetWsListenIp: {
            type: "string",
        },
        targetWsListenPort: {
            type: "number",
        },
        targetWsMaxConnections: {
            type: ["null", "number"],
        },
        targetWsRequestTimeout: {
            type: ["null", "number"],
        },
        targetWsSocketTimeout: {
            type: ["null", "number"],
        },
        targetWssCaPath: {
            type: "string",
        },
        targetWssCertPath: {
            type: "string",
        },
        targetWssKeyPath: {
            type: "string",
        },
    },
    required: [
        "targetAck",
        "targetCheckSumLengthIncluded",
        "targetCheckSumType",
        "targetDataType",
        "targetEchoTransformationRuleName",
        "targetEnableAuthenticator",
        "targetEnableHttps",
        "targetEnableTls",
        "targetEnableWss",
        "targetEnq",
        "targetEot",
        "targetEscapeChar",
        "targetHeader",
        "targetHeaderLengthIncluded",
        "targetHttpCallerAuthRuleName",
        "targetHttpCallerEnableHttps",
        "targetHttpCallerIp",
        "targetHttpCallerPath",
        "targetHttpCallerPort",
        "targetHttpCallerRejectUnauthorized",
        "targetHttpCallerReloadAuth",
        "targetHttpCallerTimeout",
        "targetHttpListenIp",
        "targetHttpListenPort",
        "targetHttpMaxConnections",
        "targetHttpRequestTimeout",
        "targetHttpSocketTimeout",
        "targetHttpsCaPath",
        "targetHttpsCertPath",
        "targetHttpsKeyPath",
        "targetIsHeaderIncludedInCkSum",
        "targetIsTrailerIncludedInCkSum",
        "targetIsoConfigPath",
        "targetKvIsEndSeparator",
        "targetKvIsStartSeparator",
        "targetKvKeyValueSeparator",
        "targetKvPairSeparator",
        "targetLogonTransformationRuleName",
        "targetNack",
        "targetPacketLengthFirst",
        "targetPacketLengthFormat",
        "targetPacketLengthIncluded",
        "targetPacketLengthLen",
        "targetPacketLengthOffset",
        "targetPacketLengthType",
        "targetSerialCallerAck",
        "targetSerialCallerBaudRate",
        "targetSerialCallerCheckSumLengthIncluded",
        "targetSerialCallerCheckSumType",
        "targetSerialCallerDataBits",
        "targetSerialCallerDataType",
        "targetSerialCallerEnq",
        "targetSerialCallerEot",
        "targetSerialCallerEscapeChar",
        "targetSerialCallerHeader",
        "targetSerialCallerHeaderLengthIncluded",
        "targetSerialCallerIsHeaderIncludedInCkSum",
        "targetSerialCallerIsTrailerIncludedInCkSum",
        "targetSerialCallerIsoConfigPath",
        "targetSerialCallerLock",
        "targetSerialCallerNack",
        "targetSerialCallerPacketLengthFirst",
        "targetSerialCallerPacketLengthFormat",
        "targetSerialCallerPacketLengthIncluded",
        "targetSerialCallerPacketLengthLen",
        "targetSerialCallerPacketLengthOffset",
        "targetSerialCallerPacketLengthType",
        "targetSerialCallerParity",
        "targetSerialCallerPort",
        "targetSerialCallerReconnectTime",
        "targetSerialCallerStopBits",
        "targetSerialCallerTimeout",
        "targetSerialCallerTrailer",
        "targetSerialCallerTrailerBeforeCksum",
        "targetSerialCallerTrailerLengthIncluded",
        "targetSerialCallerXoff",
        "targetSerialCallerXon",
        "targetTcpCallerAck",
        "targetTcpCallerCheckSumLengthIncluded",
        "targetTcpCallerCheckSumType",
        "targetTcpCallerDataType",
        "targetTcpCallerEnableTls",
        "targetTcpCallerEnq",
        "targetTcpCallerEot",
        "targetTcpCallerEscapeChar",
        "targetTcpCallerHeader",
        "targetTcpCallerHeaderLengthIncluded",
        "targetTcpCallerIp",
        "targetTcpCallerIsHeaderIncludedInCkSum",
        "targetTcpCallerIsTrailerIncludedInCkSum",
        "targetTcpCallerIsoConfigPath",
        "targetTcpCallerNack",
        "targetTcpCallerPacketLengthFirst",
        "targetTcpCallerPacketLengthFormat",
        "targetTcpCallerPacketLengthIncluded",
        "targetTcpCallerPacketLengthLen",
        "targetTcpCallerPacketLengthOffset",
        "targetTcpCallerPacketLengthType",
        "targetTcpCallerPort",
        "targetTcpCallerReconnectTime",
        "targetTcpCallerTimeout",
        "targetTcpCallerTrailer",
        "targetTcpCallerTrailerBeforeCksum",
        "targetTcpCallerTrailerLengthIncluded",
        "targetTcpListenIp",
        "targetTcpListenPort",
        "targetTcpMaxConnections",
        "targetTcpSocketTimeout",
        "targetTimerEchoTest",
        "targetTlsCaPath",
        "targetTlsCertPath",
        "targetTlsKeyPath",
        "targetTlsMaxVersion",
        "targetTlsMinVersion",
        "targetTlsRejectUnauthorized",
        "targetTlsRequestCert",
        "targetTrailer",
        "targetTrailerBeforeCksum",
        "targetTrailerLengthIncluded",
        "targetWsListenIp",
        "targetWsListenPort",
        "targetWsMaxConnections",
        "targetWsRequestTimeout",
        "targetWsSocketTimeout",
        "targetWssCaPath",
        "targetWssCertPath",
        "targetWssKeyPath",
    ],
    type: "object",
};
exports.isTargetPropsITF = exports.ajv.compile(exports.TargetPropsITFSchema);
function validate(value) {
    if (exports.isTargetPropsITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isTargetPropsITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "TargetPropsITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;
