"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Target = void 0;
const fs_1 = __importDefault(require("fs"));
const TcpCallerEndpoint_1 = require("../../models/endpoints/tcp/TcpCallerEndpoint");
const HttpCallerEndpoint_1 = require("../../models/endpoints/http/HttpCallerEndpoint");
const TcpServer_1 = require("../../models/listeners/TcpServer");
const protocol_1 = require("../../models/protocol");
const protocol_2 = require("../../models/protocol");
const WebScoketServer_1 = require("../../models/listeners/WebScoketServer");
const HttpServer_1 = require("../../models/listeners/HttpServer");
const codecs_1 = require("../../models/protocol/codecs");
const AppPropsInstance_1 = require("../properties/AppPropsInstance");
const TestMsgsBuilder_1 = require("../../modules/endpointTester/msgTesterCreator/TestMsgsBuilder");
const MsgsTesterCreatorFileType_1 = require("../../modules/endpointTester/msgTesterCreator/files/MsgsTesterCreatorFileType");
const endpointTester_1 = require("../endpointTester");
const Authenticator_1 = require("../auth/oneWayAuth/Authenticator");
const AuthMsgsBuilder_1 = require("../auth/oneWayAuth/msgAuthCreator/AuthMsgsBuilder");
const AuthenticationMakerFileType_1 = require("../auth/oneWayAuth/msgAuthCreator/files/AuthenticationMakerFileType");
const msgTypes_1 = require("../auth/oneWayAuth/msgTypes");
const LoggersColletion_1 = require("../logger/LoggersColletion");
const SerialCallerEndpoint_1 = require("../../models/endpoints/serial/SerialCallerEndpoint");
class Target {
    constructor() {
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.opts = AppPropsInstance_1.AppPropsInstance.getInstance().target;
        const { targetEnableAuthenticator } = this.opts;
        if (targetEnableAuthenticator)
            this.authenticator = this.getAuthenticator();
    }
    getListenerTcpEndpoints() {
        const { opts } = this;
        const parser = {
            parseProperties: () => {
                return {
                    listenPort: opts.targetTcpListenPort,
                    listenIp: opts.targetTcpListenIp,
                    enableTls: opts.targetEnableTls,
                    maxConnections: opts.targetTcpMaxConnections,
                    socketTimeout: opts.targetTcpSocketTimeout,
                    tlsCertPath: opts.targetTlsCertPath,
                    tlsKeyPath: opts.targetTlsKeyPath,
                    tlsRequestCert: opts.targetTlsRequestCert,
                    tlsRejectUnauthorized: opts.targetTlsRejectUnauthorized,
                    tlsCaPath: opts.targetTlsCaPath,
                    tlsMaxVersion: opts.targetTlsMaxVersion,
                    tlsMinVersion: opts.targetTlsMinVersion,
                    listenGroup: opts.targetListenGroup,
                };
            },
        };
        const props = {
            formatter: protocol_2.Formatter.get(opts.targetDataType, {
                configFilePath: opts.targetIsoConfigPath,
                isEndSeperator: opts.targetKvIsEndSeparator,
                isStartSeparator: opts.targetKvIsStartSeparator,
                keyValueSeparator: opts.targetKvKeyValueSeparator,
                pairSeparator: opts.targetKvPairSeparator,
            }),
            packetLength: protocol_2.PacketLength.get(opts.targetPacketLengthType, opts.targetPacketLengthLen, {
                format: opts.targetPacketLengthFormat,
                packetLengthIncluded: opts.targetPacketLengthIncluded,
                delimiter: Buffer.from(opts.targetTrailer, "hex"),
            }),
            header: new protocol_2.Header(Buffer.from(opts.targetHeader, "hex")),
            trailer: new protocol_2.Trailer(Buffer.from(opts.targetTrailer, "hex")),
            checkSum: protocol_2.CheckSum.get(opts.targetCheckSumType, {
                poly: opts.targetCrcPoly,
                xor_in: opts.targetCrcXorIn,
                xor_out: opts.targetCrcXorOut,
                reflect: opts.targetCrcReflect,
            }),
            ack: new protocol_2.Ack(Buffer.from(opts.targetAck, "hex")),
            nack: new protocol_2.Nack(Buffer.from(opts.targetNack, "hex")),
            eot: new protocol_2.Eot(Buffer.from(opts.targetEot, "hex")),
            enq: new protocol_1.Enq(Buffer.from(opts.targetEnq, "hex")),
            escape: new protocol_2.Escape(Buffer.from(opts.targetEscapeChar, "hex")),
            options: {
                trailerLengthIncluded: opts.targetTrailerLengthIncluded,
                headerLengthIncluded: opts.targetHeaderLengthIncluded,
                checkSumLengthIncluded: opts.targetCheckSumLengthIncluded,
                trailerBeforeCksum: opts.targetTrailerBeforeCksum,
                isHeaderIncludedInCkSum: opts.targetIsHeaderIncludedInCkSum,
                isTrailerIncludedInCkSum: opts.targetIsTrailerIncludedInCkSum,
                packetLengthOffset: opts.targetPacketLengthOffset,
                packetLengthFirst: opts.targetPacketLengthFirst,
            },
        };
        return new TcpServer_1.TcpServer("target", props, parser).setLogPrefix("[Target][TcpServer]");
    }
    getListenerHttpEndpoints() {
        const { opts } = this;
        const parser = {
            parseProperties: () => {
                return {
                    listenPort: opts.targetHttpListenPort,
                    listenIp: opts.targetHttpListenIp,
                    maxConnections: opts.targetHttpMaxConnections,
                    socketTimeout: opts.targetHttpSocketTimeout,
                    requestTimeout: opts.targetHttpRequestTimeout,
                    enableHttps: opts.targetEnableHttps,
                    httpsCertPath: opts.targetHttpsCertPath,
                    httpsKeyPath: opts.targetHttpsKeyPath,
                    httpsCaPath: opts.targetHttpsCaPath,
                    listenGroup: opts.targetListenGroup,
                };
            },
        };
        const formatter = {
            "application/json": new codecs_1.Json(),
            "application/xml": new codecs_1.XML(),
            "application/kvp": new codecs_1.KV(opts.targetKvPairSeparator, opts.targetKvKeyValueSeparator, opts.targetKvIsStartSeparator, opts.targetKvIsEndSeparator),
            "application/msgpack": new codecs_1.MsgPack(),
        };
        if (opts.targetIsoConfigPath && fs_1.default.existsSync(opts.targetIsoConfigPath))
            formatter["application/iso8583"] = new codecs_1.ISO8583(opts.targetIsoConfigPath);
        return new HttpServer_1.HttpServer("target", parser, formatter).setLogPrefix("[Target][HttpServer]");
    }
    getListenerWsEndpoints() {
        const { opts } = this;
        const parser = {
            parseProperties: () => {
                return {
                    listenPort: opts.targetWsListenPort,
                    listenIp: opts.targetWsListenIp,
                    maxConnections: opts.targetWsMaxConnections,
                    socketTimeout: opts.targetWsSocketTimeout,
                    requestTimeout: opts.targetWsRequestTimeout,
                    enableWss: opts.targetEnableWss,
                    wssCertPath: opts.targetWssCertPath,
                    wssKeyPath: opts.targetWssKeyPath,
                    wssCaPath: opts.targetWssCaPath,
                    listenGroup: opts.targetListenGroup,
                };
            },
        };
        const formatter = {
            "application/json": new codecs_1.Json(),
            "application/xml": new codecs_1.XML(),
            "application/kvp": new codecs_1.KV(opts.targetKvPairSeparator, opts.targetKvKeyValueSeparator, opts.targetKvIsStartSeparator, opts.targetKvIsEndSeparator),
            "application/msgpack": new codecs_1.MsgPack(),
        };
        if (opts.targetIsoConfigPath && fs_1.default.existsSync(opts.targetIsoConfigPath))
            formatter["application/iso8583"] = new codecs_1.ISO8583(opts.targetIsoConfigPath);
        return new WebScoketServer_1.WebSocketServer("target", parser, formatter).setLogPrefix("[Target][WsServer]");
    }
    getCallerTcpEndpoints() {
        const ids = [];
        const callerEndpoints = [];
        const { opts } = this;
        const { targetTcpCallerIp: ips, targetTcpCallerPort: ports, targetTcpCallerEnableTls: enableTls, targetTcpCallerGroups: groups, targetTcpCallerNames: names, targetTcpCallerTimeout: timeouts, targetTcpCallerReconnectTime: reconnectTimes, targetTcpCallerHeader: headers, targetTcpCallerHeaderLengthIncluded: headersLengthInc, targetTcpCallerTrailer: trailers, targetTcpCallerTrailerLengthIncluded: trailersLengthInc, targetTcpCallerAck: acks, targetTcpCallerNack: nacks, targetTcpCallerEot: eots, targetTcpCallerEnq: enqs, targetTcpCallerDataType: dataTypes, targetTcpCallerIsoConfigPath: isoConfigPaths, targetTcpCallerCrcPoly: crcPolies = [], targetTcpCallerCrcXorIn: crcXorIns = [], targetTcpCallerCrcXorOut: crcXorOuts = [], targetTcpCallerCrcReflect: crcReflects = [], targetTcpCallerPacketLengthIncluded: packetLenInc, targetTcpCallerPacketLengthType: packetLenType, targetTcpCallerPacketLengthFormat: packetLenFormat, targetTcpCallerPacketLengthOffset: packetLenOffset, targetTcpCallerPacketLengthFirst: packetLenFirst, targetTcpCallerPacketLengthLen: packetLenLen, targetTcpCallerEscapeChar: escapeChars, targetTcpCallerCheckSumType: checkSumTypes, targetTcpCallerTrailerBeforeCksum: trailerBeforeCksums, targetTcpCallerCheckSumLengthIncluded: checkSumLenIncs, targetTcpCallerIsHeaderIncludedInCkSum: isHeaderIncsInCkSums, targetTcpCallerIsTrailerIncludedInCkSum: isTrailerIncsInCkSums, } = opts;
        if (ports.length !== ips.length)
            throw new Error("The target tcp caller ports qty are not equal to ips qty");
        if (enableTls.length !== ips.length)
            throw new Error("The target tcp caller enableTls qty are not equal to ips qty");
        if (groups && groups.length !== ips.length)
            throw new Error("The target tcp caller groups qty are not equal to ips qty");
        if (names && names.length !== ips.length)
            throw new Error("The target tcp caller names qty are not equal to ips qty");
        if (timeouts.length !== ips.length)
            throw new Error("The target tcp caller timeouts qty are not equal to ips qty");
        if (reconnectTimes.length !== ips.length)
            throw new Error("The target tcp caller reconnectTimes qty are not equal to ips qty");
        if (headers.length !== ips.length)
            throw new Error("The target tcp caller headers qty are not equal to ips qty");
        if (headersLengthInc.length !== ips.length)
            throw new Error("The target tcp caller headersLengthInc qty are not equal to ips qty");
        if (trailers.length !== ips.length)
            throw new Error("The target tcp caller trailers qty are not equal to ips qty");
        if (trailersLengthInc.length !== ips.length)
            throw new Error("The target tcp caller trailersLengthInc qty are not equal to ips qty");
        if (acks.length !== ips.length)
            throw new Error("The target tcp caller acks qty are not equal to ips qty");
        if (nacks.length !== ips.length)
            throw new Error("The target tcp caller nacks qty are not equal to ips qty");
        if (eots.length !== ips.length)
            throw new Error("The target tcp caller eots qty are not equal to ips qty");
        if (enqs.length !== ips.length)
            throw new Error("The target tcp caller enqs qty are not equal to ips qty");
        if (dataTypes.length !== ips.length)
            throw new Error("The target tcp caller data types qty are not equal to ips qty");
        if (isoConfigPaths.length !== ips.length)
            throw new Error("The target tcp caller iso config paths qty are not equal to ips qty");
        if (crcPolies.length && crcPolies.length !== ips.length)
            throw new Error("The target tcp caller crcPolies qty are not equal to ips qty");
        if (crcXorIns.length && crcXorIns.length !== ips.length)
            throw new Error("The target tcp caller crcXorIns qty are not equal to ips qty");
        if (crcXorOuts.length && crcXorOuts.length !== ips.length)
            throw new Error("The target tcp caller crcXorOuts qty are not equal to ips qty");
        if (crcReflects.length && crcReflects.length !== ips.length)
            throw new Error("The target tcp caller crcReflects qty are not equal to ips qty");
        if (packetLenInc.length !== ips.length)
            throw new Error("The target tcp caller packet len inc qty are not equal to ips qty");
        if (packetLenType.length !== ips.length)
            throw new Error("The target tcp caller packet len type qty are not equal to ips qty");
        if (packetLenFormat.length !== ips.length)
            throw new Error("The target tcp caller packet len format qty are not equal to ips qty");
        if (packetLenOffset.length !== ips.length)
            throw new Error("The target tcp caller packet len offset qty are not equal to ips qty");
        if (packetLenFirst.length !== ips.length)
            throw new Error("The target tcp caller packet len first qty are not equal to ips qty");
        if (packetLenLen.length !== ips.length)
            throw new Error("The target tcp caller packet len len qty are not equal to ips qty");
        if (escapeChars.length !== ips.length)
            throw new Error("The target tcp caller escapeChars qty are not equal to ips qty");
        if (checkSumTypes.length !== ips.length)
            throw new Error("The target tcp caller checkSum types qty are not equal to ips qty");
        if (trailerBeforeCksums.length !== ips.length)
            throw new Error("The target tcp caller trailerBeforeChsums qty are not equal to ips qty");
        if (checkSumLenIncs.length !== ips.length)
            throw new Error("The target tcp caller checkSumLenIncs qty are not equal to ips qty");
        if (isHeaderIncsInCkSums.length !== ips.length)
            throw new Error("The target tcp caller isHeaderEncsInCkSums qty are not equal to ips qty");
        if (isTrailerIncsInCkSums.length !== ips.length)
            throw new Error("The target tcp caller isTrailerIncsInCkSums qty are not equal to ips qty");
        for (const num in ips) {
            const formatter = protocol_2.Formatter.get(dataTypes[num], {
                configFilePath: opts.targetIsoConfigPath,
                isEndSeperator: opts.targetKvIsEndSeparator,
                isStartSeparator: opts.targetKvIsStartSeparator,
                keyValueSeparator: opts.targetKvKeyValueSeparator,
                pairSeparator: opts.targetKvPairSeparator,
            });
            const packetLength = protocol_2.PacketLength.get(packetLenType[num], packetLenLen[num], {
                format: packetLenFormat[num],
                packetLengthIncluded: packetLenInc[num],
                delimiter: Buffer.from(trailers[num], "hex"),
            });
            const header = new protocol_2.Header(Buffer.from(headers[num], "hex"));
            const trailer = new protocol_2.Trailer(Buffer.from(trailers[num], "hex"));
            const checkSum = protocol_2.CheckSum.get(checkSumTypes[num], {
                poly: crcPolies[num],
                xor_in: crcXorIns[num],
                xor_out: crcXorOuts[num],
                reflect: crcReflects[num],
            });
            const ack = new protocol_2.Ack(Buffer.from(acks[num], "hex"));
            const nack = new protocol_2.Nack(Buffer.from(nacks[num], "hex"));
            const eot = new protocol_2.Nack(Buffer.from(eots[num], "hex"));
            const enq = new protocol_1.Enq(Buffer.from(enqs[num], "hex"));
            const escape = new protocol_2.Escape(Buffer.from(escapeChars[num], "hex"));
            const options = {
                trailerLengthIncluded: trailersLengthInc[num],
                headerLengthIncluded: headersLengthInc[num],
                checkSumLengthIncluded: checkSumLenIncs[num],
                trailerBeforeCksum: trailerBeforeCksums[num],
                isHeaderIncludedInCkSum: isHeaderIncsInCkSums[num],
                isTrailerIncludedInCkSum: isTrailerIncsInCkSums[num],
                packetLengthOffset: packetLenOffset[num],
                packetLengthFirst: packetLenFirst[num],
            };
            const newProtocol = new protocol_1.Protocol(formatter, packetLength, header, trailer, checkSum, escape, ack, nack, enq, eot, options);
            const newEndpoint = new TcpCallerEndpoint_1.TcpCallerEndpoint(ips[num], ports[num], timeouts[num], enableTls[num], reconnectTimes[num], newProtocol);
            newProtocol.setId(newEndpoint.id);
            callerEndpoints.push(newEndpoint);
            const id = groups && groups[num] ? groups[num] : "-1";
            ids.push(id);
        }
        return { ids, names, endpoints: callerEndpoints };
    }
    getCallerHttpEndpoints() {
        const ids = [], endpoints = [];
        const { opts } = this;
        const { targetHttpCallerIp: ips, targetHttpCallerPort: ports, targetHttpCallerPath: paths, targetHttpCallerEnableHttps: enableHttps, targetHttpCallerGroups: groups, targetHttpCallerNames: names, targetHttpCallerTimeout: timeouts, targetHttpCallerAuthKey: authKeys, targetHttpCallerRejectUnauthorized: rejUnauthorized, } = opts;
        const formatter = {
            "application/json": new codecs_1.Json(),
            "application/xml": new codecs_1.XML(),
            "application/kvp": new codecs_1.KV(opts.targetKvPairSeparator, opts.targetKvKeyValueSeparator, opts.targetKvIsStartSeparator, opts.targetKvIsEndSeparator),
            "application/msgpack": new codecs_1.MsgPack(),
        };
        if (opts.targetIsoConfigPath && fs_1.default.existsSync(opts.targetIsoConfigPath))
            formatter["application/iso8583"] = new codecs_1.ISO8583(opts.targetIsoConfigPath);
        if (ports.length !== ips.length)
            throw new Error("The target http caller ports qty are not equal to ips qty");
        if (enableHttps.length !== ips.length)
            throw new Error("The target http caller enableHttps qty are not equal to ips qty");
        if (paths.length !== ips.length)
            throw new Error("The target http caller paths qty are not equal to ips qty");
        if (groups && groups.length !== ips.length)
            throw new Error("The target http caller groups qty are not equal to ips qty");
        if (names && names.length !== ips.length)
            throw new Error("The target http caller names qty are not equal to ips qty");
        if (timeouts.length !== ips.length)
            throw new Error("The target http caller timeouts qty are not equal to ips qty");
        if (authKeys && authKeys.length !== ips.length)
            throw new Error("The target http caller authKeys qty are not equal to ips qty");
        if (rejUnauthorized.length !== ips.length)
            throw new Error("The target http caller rejUnauthorized qty are not equal to ips qty");
        for (const num in ips) {
            const endpoint = new HttpCallerEndpoint_1.HttpCallerEndpoint(ips[num], ports[num], paths[num], timeouts[num], enableHttps[num], rejUnauthorized[num], formatter, authKeys && authKeys[num] ? authKeys[num] : null);
            endpoints.push(endpoint);
            const id = groups && groups[num] ? groups[num] : "-1";
            ids.push(id);
            if (this.authenticator)
                this.authenticator.addEndpoint(endpoint);
        }
        return { ids, names, endpoints };
    }
    getCallerSerialEndpoints() {
        const ids = [];
        const callerEndpoints = [];
        const { opts } = this;
        const { targetSerialCallerBaudRate: baudRates, targetSerialCallerDataBits: dataBits, targetSerialCallerLock: locks, targetSerialCallerParity: parities, targetSerialCallerPort: ports, targetSerialCallerStopBits: stopBits, targetSerialCallerXoff: xoffs, targetSerialCallerXon: xons, targetSerialCallerGroups: groups, targetSerialCallerNames: names, targetSerialCallerTimeout: timeouts, targetSerialCallerReconnectTime: reconnectTimes, targetSerialCallerHeader: headers, targetSerialCallerHeaderLengthIncluded: headersLengthInc, targetSerialCallerTrailer: trailers, targetSerialCallerTrailerLengthIncluded: trailersLengthInc, targetSerialCallerAck: acks, targetSerialCallerNack: nacks, targetSerialCallerEot: eots, targetSerialCallerEnq: enqs, targetSerialCallerDataType: dataTypes, targetSerialCallerIsoConfigPath: isoConfigPaths, targetSerialCallerCrcPoly: crcPolies = [], targetSerialCallerCrcXorIn: crcXorIns = [], targetSerialCallerCrcXorOut: crcXorOuts = [], targetSerialCallerCrcReflect: crcReflects = [], targetSerialCallerPacketLengthIncluded: packetLenInc, targetSerialCallerPacketLengthType: packetLenType, targetSerialCallerPacketLengthFormat: packetLenFormat, targetSerialCallerPacketLengthOffset: packetLenOffset, targetSerialCallerPacketLengthFirst: packetLenFirst, targetSerialCallerPacketLengthLen: packetLenLen, targetSerialCallerEscapeChar: escapeChars, targetSerialCallerCheckSumType: checkSumTypes, targetSerialCallerTrailerBeforeCksum: trailerBeforeCksums, targetSerialCallerCheckSumLengthIncluded: checkSumLenIncs, targetSerialCallerIsHeaderIncludedInCkSum: isHeaderIncsInCkSums, targetSerialCallerIsTrailerIncludedInCkSum: isTrailerIncsInCkSums, } = opts;
        if (baudRates && baudRates.length !== ports.length)
            throw new Error("The target serial caller baudRates qty are not equal to ports qty");
        if (dataBits && dataBits.length !== ports.length)
            throw new Error("The target serial caller dataBits qty are not equal to ports qty");
        if (locks && locks.length !== ports.length)
            throw new Error("The target serial caller locks qty are not equal to ports qty");
        if (parities && parities.length !== ports.length)
            throw new Error("The target serial caller parities qty are not equal to ports qty");
        if (stopBits && stopBits.length !== ports.length)
            throw new Error("The target serial caller stopBits qty are not equal to ports qty");
        if (xoffs && xoffs.length !== ports.length)
            throw new Error("The target serial caller xoffs qty are not equal to ports qty");
        if (xons && xons.length !== ports.length)
            throw new Error("The target serial caller xons qty are not equal to ports qty");
        if (groups && groups.length !== ports.length)
            throw new Error("The target serial caller groups qty are not equal to ports qty");
        if (names && names.length !== ports.length)
            throw new Error("The target serial caller names qty are not equal to ports qty");
        if (timeouts.length !== ports.length)
            throw new Error("The target serial caller timeouts qty are not equal to ports qty");
        if (reconnectTimes.length !== ports.length)
            throw new Error("The target serial caller reconnectTimes qty are not equal to ports qty");
        if (headers.length !== ports.length)
            throw new Error("The target serial caller headers qty are not equal to ports qty");
        if (headersLengthInc.length !== ports.length)
            throw new Error("The target serial caller headersLengthInc qty are not equal to ports qty");
        if (trailers.length !== ports.length)
            throw new Error("The target serial caller trailers qty are not equal to ports qty");
        if (trailersLengthInc.length !== ports.length)
            throw new Error("The target serial caller trailersLengthInc qty are not equal to ports qty");
        if (acks.length !== ports.length)
            throw new Error("The target serial caller acks qty are not equal to ports qty");
        if (nacks.length !== ports.length)
            throw new Error("The target serial caller nacks qty are not equal to ports qty");
        if (eots.length !== ports.length)
            throw new Error("The target serial caller eots qty are not equal to ports qty");
        if (enqs.length !== ports.length)
            throw new Error("The target serial caller enqs qty are not equal to ports qty");
        if (dataTypes.length !== ports.length)
            throw new Error("The target serial caller data types qty are not equal to ports qty");
        if (isoConfigPaths.length !== ports.length)
            throw new Error("The target serial caller iso config paths qty are not equal to ports qty");
        if (crcPolies.length && crcPolies.length !== ports.length)
            throw new Error("The target serial caller crcPolies qty are not equal to ports qty");
        if (crcXorIns.length && crcXorIns.length !== ports.length)
            throw new Error("The target serial caller crcXorIns qty are not equal to ports qty");
        if (crcXorOuts.length && crcXorOuts.length !== ports.length)
            throw new Error("The target serial caller crcXorOuts qty are not equal to ports qty");
        if (crcReflects.length && crcReflects.length !== ports.length)
            throw new Error("The target serial caller crcReflects qty are not equal to ports qty");
        if (packetLenInc.length !== ports.length)
            throw new Error("The target serial caller packet len inc qty are not equal to ports qty");
        if (packetLenType.length !== ports.length)
            throw new Error("The target serial caller packet len type qty are not equal to ports qty");
        if (packetLenFormat.length !== ports.length)
            throw new Error("The target serial caller packet len format qty are not equal to ports qty");
        if (packetLenOffset.length !== ports.length)
            throw new Error("The target serial caller packet len offset qty are not equal to ports qty");
        if (packetLenFirst.length !== ports.length)
            throw new Error("The target serial caller packet len first qty are not equal to ports qty");
        if (packetLenLen.length !== ports.length)
            throw new Error("The target serial caller packet len len qty are not equal to ports qty");
        if (escapeChars.length !== ports.length)
            throw new Error("The target serial caller escapeChars qty are not equal to ports qty");
        if (checkSumTypes.length !== ports.length)
            throw new Error("The target serial caller checkSum types qty are not equal to ports qty");
        if (trailerBeforeCksums.length !== ports.length)
            throw new Error("The target serial caller trailerBeforeChsums qty are not equal to ports qty");
        if (checkSumLenIncs.length !== ports.length)
            throw new Error("The target serial caller checkSumLenIncs qty are not equal to ports qty");
        if (isHeaderIncsInCkSums.length !== ports.length)
            throw new Error("The target serial caller isHeaderEncsInCkSums qty are not equal to ports qty");
        if (isTrailerIncsInCkSums.length !== ports.length)
            throw new Error("The target serial caller isTrailerIncsInCkSums qty are not equal to ports qty");
        for (const num in ports) {
            const serialOpts = {
                baudRate: baudRates[num],
                dataBits: dataBits[num],
                lock: locks[num],
                parity: parities[num],
                stopBits: stopBits[num],
                xon: xons[num],
                xoff: xoffs[num],
            };
            const formatter = protocol_2.Formatter.get(dataTypes[num], {
                configFilePath: opts.targetIsoConfigPath,
                isEndSeperator: opts.targetKvIsEndSeparator,
                isStartSeparator: opts.targetKvIsStartSeparator,
                keyValueSeparator: opts.targetKvKeyValueSeparator,
                pairSeparator: opts.targetKvPairSeparator,
            });
            const packetLength = protocol_2.PacketLength.get(packetLenType[num], packetLenLen[num], {
                format: packetLenFormat[num],
                packetLengthIncluded: packetLenInc[num],
                delimiter: Buffer.from(trailers[num], "hex"),
            });
            const header = new protocol_2.Header(Buffer.from(headers[num], "hex"));
            const trailer = new protocol_2.Trailer(Buffer.from(trailers[num], "hex"));
            const checkSum = protocol_2.CheckSum.get(checkSumTypes[num], {
                poly: crcPolies[num],
                xor_in: crcXorIns[num],
                xor_out: crcXorOuts[num],
                reflect: crcReflects[num],
            });
            const ack = new protocol_2.Ack(Buffer.from(acks[num], "hex"));
            const nack = new protocol_2.Nack(Buffer.from(nacks[num], "hex"));
            const eot = new protocol_2.Nack(Buffer.from(eots[num], "hex"));
            const enq = new protocol_1.Enq(Buffer.from(nacks[num], "hex"));
            const escape = new protocol_2.Escape(Buffer.from(escapeChars[num], "hex"));
            const options = {
                trailerLengthIncluded: trailersLengthInc[num],
                headerLengthIncluded: headersLengthInc[num],
                checkSumLengthIncluded: checkSumLenIncs[num],
                trailerBeforeCksum: trailerBeforeCksums[num],
                isHeaderIncludedInCkSum: isHeaderIncsInCkSums[num],
                isTrailerIncludedInCkSum: isTrailerIncsInCkSums[num],
                packetLengthOffset: packetLenOffset[num],
                packetLengthFirst: packetLenFirst[num],
            };
            const newProtocol = new protocol_1.Protocol(formatter, packetLength, header, trailer, checkSum, escape, ack, nack, enq, eot, options);
            const newEndpoint = new SerialCallerEndpoint_1.SerialCallerEndpoint(ports[num], serialOpts, timeouts[num], reconnectTimes[num], newProtocol);
            newProtocol.setId(newEndpoint.id);
            callerEndpoints.push(newEndpoint);
            const id = groups && groups[num] ? groups[num] : "-1";
            ids.push(id);
        }
        return { ids, names, endpoints: callerEndpoints };
    }
    getEndpointsTester() {
        const { controlMsgReloadFileInterval, controlMsgReloadFileMode, controlMsgsRulesFilePath } = AppPropsInstance_1.AppPropsInstance.getInstance().controlMsgs;
        const transformation = new TestMsgsBuilder_1.TestMsgsBuilder({
            transformFilePathList: controlMsgsRulesFilePath.split(","),
            reloadFileMode: controlMsgReloadFileMode,
            reloadFileInterval: controlMsgReloadFileInterval,
            applyDefaultRule: false,
            logPrefix: "[Target][TestMsgsBuilder]",
        });
        transformation.initLoad();
        const { targetTimerEchoTest, targetEchoTransformationRuleName, targetLogonTransformationRuleName } = this.opts;
        const directions = { send: MsgsTesterCreatorFileType_1.TesterDirectionsAvbEnum.ClientToTarget, rcv: MsgsTesterCreatorFileType_1.TesterDirectionsAvbEnum.TargetToClient };
        const controMsgs = {
            echo: new endpointTester_1.Echo(transformation, directions, targetEchoTransformationRuleName),
            logon: new endpointTester_1.LogOn(transformation, directions, targetLogonTransformationRuleName),
        };
        // Control Endpoints Tester
        const tester = new endpointTester_1.EndpointTester(controMsgs, targetTimerEchoTest);
        tester.setLogPrefix("[Target][EndpointTester]");
        return tester;
    }
    getAuthenticator() {
        const { authenticatorReloadFileMode, authenticatorRulesFilePath, authenticatorReloadFileInterval, authenticatorExtFunctionsFolderPath, } = AppPropsInstance_1.AppPropsInstance.getInstance().authenticator;
        const transformation = new AuthMsgsBuilder_1.AuthMsgsBuilder({
            transformFilePathList: authenticatorRulesFilePath.split(","),
            reloadFileMode: authenticatorReloadFileMode,
            reloadFileInterval: authenticatorReloadFileInterval,
            applyDefaultRule: false,
            logPrefix: "[Target][AuthMsgsBuilder]",
            extensionFunctionsFolderPath: authenticatorExtFunctionsFolderPath,
        });
        transformation.initLoad();
        const { targetHttpCallerReloadAuth, targetHttpCallerAuthRuleName } = this.opts;
        const directions = { send: AuthenticationMakerFileType_1.AuthDirectionsAvbEnum.Request, rcv: AuthenticationMakerFileType_1.AuthDirectionsAvbEnum.Response };
        const controMsgs = {
            tokenAuth: new msgTypes_1.Login(transformation, directions, targetHttpCallerAuthRuleName),
        };
        const auth = new Authenticator_1.Authenticator(controMsgs, targetHttpCallerReloadAuth);
        auth.setLogPrefix("[Target][Authenticator]");
        return auth;
    }
}
exports.Target = Target;
