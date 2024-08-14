"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClientPropsITF = exports.ClientPropsITFSchema = exports.ajv = void 0;
/* tslint:disable */
// generated by typescript-json-validator
const util_1 = require("util");
const Ajv = require("ajv");
exports.ajv = new Ajv({ allErrors: true, coerceTypes: false, format: "fast", nullable: true, unicode: true, uniqueItems: true, useDefaults: true });
exports.ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
exports.ClientPropsITFSchema = {
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
        clientAck: {
            type: "string",
        },
        clientCheckSumLengthIncluded: {
            type: "boolean",
        },
        clientCheckSumType: {
            $ref: "#/definitions/CheckSumAvb",
        },
        clientCrcPoly: {
            type: "number",
        },
        clientCrcReflect: {
            type: "boolean",
        },
        clientCrcXorIn: {
            type: "number",
        },
        clientCrcXorOut: {
            type: "number",
        },
        clientDataType: {
            $ref: "#/definitions/FormattersAvb",
        },
        clientEchoTransformationRuleName: {
            type: "string",
        },
        clientEnableAuthenticator: {
            type: "boolean",
        },
        clientEnableHttps: {
            type: "boolean",
        },
        clientEnableTls: {
            type: "boolean",
        },
        clientEnableWss: {
            type: "boolean",
        },
        clientEnq: {
            type: "string",
        },
        clientEot: {
            type: "string",
        },
        clientEscapeChar: {
            type: "string",
        },
        clientHeader: {
            type: "string",
        },
        clientHeaderLengthIncluded: {
            type: "boolean",
        },
        clientHttpCallerAuthKey: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientHttpCallerAuthRuleName: {
            type: "string",
        },
        clientHttpCallerEnableHttps: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientHttpCallerGroups: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientHttpCallerIp: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientHttpCallerNames: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientHttpCallerPath: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientHttpCallerPort: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientHttpCallerRejectUnauthorized: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientHttpCallerReloadAuth: {
            type: "number",
        },
        clientHttpCallerTimeout: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientHttpListenIp: {
            type: "string",
        },
        clientHttpListenPort: {
            type: "number",
        },
        clientHttpMaxConnections: {
            type: ["null", "number"],
        },
        clientHttpRequestTimeout: {
            type: ["null", "number"],
        },
        clientHttpSocketTimeout: {
            type: ["null", "number"],
        },
        clientHttpsCaPath: {
            type: "string",
        },
        clientHttpsCertPath: {
            type: "string",
        },
        clientHttpsKeyPath: {
            type: "string",
        },
        clientIsHeaderIncludedInCkSum: {
            type: "boolean",
        },
        clientIsTrailerIncludedInCkSum: {
            type: "boolean",
        },
        clientIsoConfigPath: {
            type: "string",
        },
        clientKvIsEndSeparator: {
            type: "boolean",
        },
        clientKvIsStartSeparator: {
            type: "boolean",
        },
        clientKvKeyValueSeparator: {
            type: "string",
        },
        clientKvPairSeparator: {
            type: "string",
        },
        clientListenGroup: {
            type: "string",
        },
        clientLogonTransformationRuleName: {
            type: "string",
        },
        clientNack: {
            type: "string",
        },
        clientPacketLengthFirst: {
            type: "boolean",
        },
        clientPacketLengthFormat: {
            $ref: "#/definitions/PacketLengthFormat",
        },
        clientPacketLengthIncluded: {
            type: "boolean",
        },
        clientPacketLengthLen: {
            enum: [0, 1, 2, 3, 4, 5, 6],
            type: "number",
        },
        clientPacketLengthOffset: {
            type: "number",
        },
        clientPacketLengthType: {
            $ref: "#/definitions/PacketLengthAvb",
        },
        clientSerialCallerAck: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerBaudRate: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientSerialCallerCheckSumLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerCheckSumType: {
            items: {
                enum: ["crc16", "crc32", "crc8", "lrc", "none"],
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerCrcPoly: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientSerialCallerCrcReflect: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerCrcXorIn: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientSerialCallerCrcXorOut: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientSerialCallerDataBits: {
            items: {
                enum: [5, 6, 7, 8],
                type: "number",
            },
            type: "array",
        },
        clientSerialCallerDataType: {
            items: {
                enum: ["dictc", "iso8583", "json", "kvp", "msgpack", "text", "textHex", "xml"],
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerEnq: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerEot: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerEscapeChar: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerGroups: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerHeader: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerHeaderLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerIsHeaderIncludedInCkSum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerIsTrailerIncludedInCkSum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerIsoConfigPath: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerLock: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerNack: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerNames: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerPacketLengthFirst: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerPacketLengthFormat: {
            items: {
                enum: ["dec", "hex"],
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerPacketLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerPacketLengthLen: {
            items: {
                enum: [0, 1, 2, 3, 4, 5, 6],
                type: "number",
            },
            type: "array",
        },
        clientSerialCallerPacketLengthOffset: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientSerialCallerPacketLengthType: {
            items: {
                enum: ["ascii", "delimiter", "none", "uintbe", "uintle"],
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerParity: {
            items: {
                enum: ["even", "mark", "none", "odd", "space"],
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerPort: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerReconnectTime: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientSerialCallerStopBits: {
            items: {
                enum: [1, 2],
                type: "number",
            },
            type: "array",
        },
        clientSerialCallerTimeout: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientSerialCallerTrailer: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientSerialCallerTrailerBeforeCksum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerTrailerLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerXoff: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientSerialCallerXon: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpCallerAck: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerCheckSumLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpCallerCheckSumType: {
            items: {
                enum: ["crc16", "crc32", "crc8", "lrc", "none"],
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerCrcPoly: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientTcpCallerCrcReflect: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpCallerCrcXorIn: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientTcpCallerCrcXorOut: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientTcpCallerDataType: {
            items: {
                enum: ["dictc", "iso8583", "json", "kvp", "msgpack", "text", "textHex", "xml"],
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerEnableTls: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpCallerEnq: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerEot: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerEscapeChar: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerGroups: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerHeader: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerHeaderLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpCallerIp: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerIsHeaderIncludedInCkSum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpCallerIsTrailerIncludedInCkSum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpCallerIsoConfigPath: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerNack: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerNames: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerPacketLengthFirst: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpCallerPacketLengthFormat: {
            items: {
                enum: ["dec", "hex"],
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerPacketLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpCallerPacketLengthLen: {
            items: {
                enum: [0, 1, 2, 3, 4, 5, 6],
                type: "number",
            },
            type: "array",
        },
        clientTcpCallerPacketLengthOffset: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientTcpCallerPacketLengthType: {
            items: {
                enum: ["ascii", "delimiter", "none", "uintbe", "uintle"],
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerPort: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientTcpCallerReconnectTime: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientTcpCallerTimeout: {
            items: {
                type: "number",
            },
            type: "array",
        },
        clientTcpCallerTrailer: {
            items: {
                type: "string",
            },
            type: "array",
        },
        clientTcpCallerTrailerBeforeCksum: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpCallerTrailerLengthIncluded: {
            items: {
                type: "boolean",
            },
            type: "array",
        },
        clientTcpListenIp: {
            type: "string",
        },
        clientTcpListenPort: {
            type: "number",
        },
        clientTcpMaxConnections: {
            type: ["null", "number"],
        },
        clientTcpSocketTimeout: {
            type: ["null", "number"],
        },
        clientTimerEchoTest: {
            type: "number",
        },
        clientTlsCaPath: {
            type: "string",
        },
        clientTlsCertPath: {
            type: "string",
        },
        clientTlsKeyPath: {
            type: "string",
        },
        clientTlsMaxVersion: {
            $ref: "#/definitions/tlsVersionsKey",
        },
        clientTlsMinVersion: {
            $ref: "#/definitions/tlsVersionsKey",
        },
        clientTlsRejectUnauthorized: {
            type: "boolean",
        },
        clientTlsRequestCert: {
            type: "boolean",
        },
        clientTrailer: {
            type: "string",
        },
        clientTrailerBeforeCksum: {
            type: "boolean",
        },
        clientTrailerLengthIncluded: {
            type: "boolean",
        },
        clientWsListenIp: {
            type: "string",
        },
        clientWsListenPort: {
            type: "number",
        },
        clientWsMaxConnections: {
            type: ["null", "number"],
        },
        clientWsRequestTimeout: {
            type: ["null", "number"],
        },
        clientWsSocketTimeout: {
            type: ["null", "number"],
        },
        clientWssCaPath: {
            type: "string",
        },
        clientWssCertPath: {
            type: "string",
        },
        clientWssKeyPath: {
            type: "string",
        },
    },
    required: [
        "clientAck",
        "clientCheckSumLengthIncluded",
        "clientCheckSumType",
        "clientDataType",
        "clientEchoTransformationRuleName",
        "clientEnableAuthenticator",
        "clientEnableHttps",
        "clientEnableTls",
        "clientEnableWss",
        "clientEnq",
        "clientEot",
        "clientEscapeChar",
        "clientHeader",
        "clientHeaderLengthIncluded",
        "clientHttpCallerAuthRuleName",
        "clientHttpCallerEnableHttps",
        "clientHttpCallerIp",
        "clientHttpCallerPath",
        "clientHttpCallerPort",
        "clientHttpCallerRejectUnauthorized",
        "clientHttpCallerReloadAuth",
        "clientHttpCallerTimeout",
        "clientHttpListenIp",
        "clientHttpListenPort",
        "clientHttpMaxConnections",
        "clientHttpRequestTimeout",
        "clientHttpSocketTimeout",
        "clientHttpsCaPath",
        "clientHttpsCertPath",
        "clientHttpsKeyPath",
        "clientIsHeaderIncludedInCkSum",
        "clientIsTrailerIncludedInCkSum",
        "clientIsoConfigPath",
        "clientKvIsEndSeparator",
        "clientKvIsStartSeparator",
        "clientKvKeyValueSeparator",
        "clientKvPairSeparator",
        "clientLogonTransformationRuleName",
        "clientNack",
        "clientPacketLengthFirst",
        "clientPacketLengthFormat",
        "clientPacketLengthIncluded",
        "clientPacketLengthLen",
        "clientPacketLengthOffset",
        "clientPacketLengthType",
        "clientSerialCallerAck",
        "clientSerialCallerBaudRate",
        "clientSerialCallerCheckSumLengthIncluded",
        "clientSerialCallerCheckSumType",
        "clientSerialCallerDataBits",
        "clientSerialCallerDataType",
        "clientSerialCallerEnq",
        "clientSerialCallerEot",
        "clientSerialCallerEscapeChar",
        "clientSerialCallerHeader",
        "clientSerialCallerHeaderLengthIncluded",
        "clientSerialCallerIsHeaderIncludedInCkSum",
        "clientSerialCallerIsTrailerIncludedInCkSum",
        "clientSerialCallerIsoConfigPath",
        "clientSerialCallerLock",
        "clientSerialCallerNack",
        "clientSerialCallerPacketLengthFirst",
        "clientSerialCallerPacketLengthFormat",
        "clientSerialCallerPacketLengthIncluded",
        "clientSerialCallerPacketLengthLen",
        "clientSerialCallerPacketLengthOffset",
        "clientSerialCallerPacketLengthType",
        "clientSerialCallerParity",
        "clientSerialCallerPort",
        "clientSerialCallerReconnectTime",
        "clientSerialCallerStopBits",
        "clientSerialCallerTimeout",
        "clientSerialCallerTrailer",
        "clientSerialCallerTrailerBeforeCksum",
        "clientSerialCallerTrailerLengthIncluded",
        "clientSerialCallerXoff",
        "clientSerialCallerXon",
        "clientTcpCallerAck",
        "clientTcpCallerCheckSumLengthIncluded",
        "clientTcpCallerCheckSumType",
        "clientTcpCallerDataType",
        "clientTcpCallerEnableTls",
        "clientTcpCallerEnq",
        "clientTcpCallerEot",
        "clientTcpCallerEscapeChar",
        "clientTcpCallerHeader",
        "clientTcpCallerHeaderLengthIncluded",
        "clientTcpCallerIp",
        "clientTcpCallerIsHeaderIncludedInCkSum",
        "clientTcpCallerIsTrailerIncludedInCkSum",
        "clientTcpCallerIsoConfigPath",
        "clientTcpCallerNack",
        "clientTcpCallerPacketLengthFirst",
        "clientTcpCallerPacketLengthFormat",
        "clientTcpCallerPacketLengthIncluded",
        "clientTcpCallerPacketLengthLen",
        "clientTcpCallerPacketLengthOffset",
        "clientTcpCallerPacketLengthType",
        "clientTcpCallerPort",
        "clientTcpCallerReconnectTime",
        "clientTcpCallerTimeout",
        "clientTcpCallerTrailer",
        "clientTcpCallerTrailerBeforeCksum",
        "clientTcpCallerTrailerLengthIncluded",
        "clientTcpListenIp",
        "clientTcpListenPort",
        "clientTcpMaxConnections",
        "clientTcpSocketTimeout",
        "clientTimerEchoTest",
        "clientTlsCaPath",
        "clientTlsCertPath",
        "clientTlsKeyPath",
        "clientTlsMaxVersion",
        "clientTlsMinVersion",
        "clientTlsRejectUnauthorized",
        "clientTlsRequestCert",
        "clientTrailer",
        "clientTrailerBeforeCksum",
        "clientTrailerLengthIncluded",
        "clientWsListenIp",
        "clientWsListenPort",
        "clientWsMaxConnections",
        "clientWsRequestTimeout",
        "clientWsSocketTimeout",
        "clientWssCaPath",
        "clientWssCertPath",
        "clientWssKeyPath",
    ],
    type: "object",
};
exports.isClientPropsITF = exports.ajv.compile(exports.ClientPropsITFSchema);
function validate(value) {
    if (exports.isClientPropsITF(value)) {
        return value;
    }
    else {
        throw new Error(exports.ajv.errorsText(exports.isClientPropsITF.errors.filter((e) => e.keyword !== "if"), { dataVar: "ClientPropsITF" }) +
            "\n\n" +
            util_1.inspect(value));
    }
}
exports.default = validate;