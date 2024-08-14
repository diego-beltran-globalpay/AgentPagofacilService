"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const fs_1 = __importDefault(require("fs"));
const TcpServer_1 = require("../../models/listeners/TcpServer");
const protocol_1 = require("../../models/protocol");
const protocol_2 = require("../../models/protocol");
const WebScoketServer_1 = require("../../models/listeners/WebScoketServer");
const HttpServer_1 = require("../../models/listeners/HttpServer");
const codecs_1 = require("../../models/protocol/codecs");
const TcpCallerEndpoint_1 = require("../../models/endpoints/tcp/TcpCallerEndpoint");
const HttpCallerEndpoint_1 = require("../../models/endpoints/http/HttpCallerEndpoint");
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
class Client {
    constructor() {
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.opts = AppPropsInstance_1.AppPropsInstance.getInstance().client;
        const { clientEnableAuthenticator } = this.opts;
        if (clientEnableAuthenticator)
            this.authenticator = this.getAuthenticator();
    }
    getListenerTcpEndpoints() {
        const { opts } = this;
        const parser = {
            parseProperties: () => {
                return {
                    listenPort: opts.clientTcpListenPort,
                    listenIp: opts.clientTcpListenIp,
                    maxConnections: opts.clientTcpMaxConnections,
                    socketTimeout: opts.clientTcpSocketTimeout,
                    enableTls: opts.clientEnableTls,
                    tlsCertPath: opts.clientTlsCertPath,
                    tlsKeyPath: opts.clientTlsKeyPath,
                    tlsRequestCert: opts.clientTlsRequestCert,
                    tlsRejectUnauthorized: opts.clientTlsRejectUnauthorized,
                    tlsCaPath: opts.clientTlsCaPath,
                    tlsMaxVersion: opts.clientTlsMaxVersion,
                    tlsMinVersion: opts.clientTlsMinVersion,
                    listenGroup: opts.clientListenGroup,
                };
            },
        };
        const props = {
            formatter: protocol_2.Formatter.get(opts.clientDataType, {
                configFilePath: opts.clientIsoConfigPath,
                isEndSeperator: opts.clientKvIsEndSeparator,
                isStartSeparator: opts.clientKvIsStartSeparator,
                keyValueSeparator: opts.clientKvKeyValueSeparator,
                pairSeparator: opts.clientKvPairSeparator,
            }),
            packetLength: protocol_2.PacketLength.get(opts.clientPacketLengthType, opts.clientPacketLengthLen, {
                format: opts.clientPacketLengthFormat,
                packetLengthIncluded: opts.clientPacketLengthIncluded,
                delimiter: Buffer.from(opts.clientTrailer, "hex"),
            }),
            header: new protocol_2.Header(Buffer.from(opts.clientHeader, "hex")),
            trailer: new protocol_2.Trailer(Buffer.from(opts.clientTrailer, "hex")),
            checkSum: protocol_2.CheckSum.get(opts.clientCheckSumType, {
                poly: opts.clientCrcPoly,
                xor_in: opts.clientCrcXorIn,
                xor_out: opts.clientCrcXorOut,
                reflect: opts.clientCrcReflect,
            }),
            ack: new protocol_2.Ack(Buffer.from(opts.clientAck, "hex")),
            nack: new protocol_2.Nack(Buffer.from(opts.clientNack, "hex")),
            eot: new protocol_2.Eot(Buffer.from(opts.clientEot, "hex")),
            enq: new protocol_1.Enq(Buffer.from(opts.clientEnq, "hex")),
            escape: new protocol_2.Escape(Buffer.from(opts.clientEscapeChar, "hex")),
            options: {
                trailerLengthIncluded: opts.clientTrailerLengthIncluded,
                headerLengthIncluded: opts.clientHeaderLengthIncluded,
                checkSumLengthIncluded: false,
                trailerBeforeCksum: opts.clientTrailerBeforeCksum,
                isHeaderIncludedInCkSum: false,
                isTrailerIncludedInCkSum: false,
                packetLengthOffset: opts.clientPacketLengthOffset,
                packetLengthFirst: opts.clientPacketLengthFirst,
            },
        };
        return new TcpServer_1.TcpServer("client", props, parser).setLogPrefix("[Client][TcpServer]");
    }
    getListenerHttpEndpoints() {
        const { opts } = this;
        const parser = {
            parseProperties: () => {
                return {
                    listenPort: opts.clientHttpListenPort,
                    listenIp: opts.clientHttpListenIp,
                    maxConnections: opts.clientHttpMaxConnections,
                    socketTimeout: opts.clientHttpSocketTimeout,
                    requestTimeout: opts.clientHttpRequestTimeout,
                    enableHttps: opts.clientEnableHttps,
                    httpsCertPath: opts.clientHttpsCertPath,
                    httpsKeyPath: opts.clientHttpsKeyPath,
                    httpsCaPath: opts.clientHttpsCaPath,
                    listenGroup: opts.clientListenGroup,
                };
            },
        };
        const formatter = {
            "application/json": new codecs_1.Json(),
            "application/xml": new codecs_1.XML(),
            "application/kvp": new codecs_1.KV(opts.clientKvPairSeparator, opts.clientKvKeyValueSeparator, opts.clientKvIsStartSeparator, opts.clientKvIsEndSeparator),
            "application/msgpack": new codecs_1.MsgPack(),
        };
        if (opts.clientIsoConfigPath && fs_1.default.existsSync(opts.clientIsoConfigPath))
            formatter["application/iso8583"] = new codecs_1.ISO8583(opts.clientIsoConfigPath);
        return new HttpServer_1.HttpServer("client", parser, formatter).setLogPrefix("[Client][HttpServer]");
    }
    getListenerWsEndpoints() {
        const { opts } = this;
        const parser = {
            parseProperties: () => {
                return {
                    listenPort: opts.clientWsListenPort,
                    listenIp: opts.clientWsListenIp,
                    maxConnections: opts.clientWsMaxConnections,
                    socketTimeout: opts.clientWsSocketTimeout,
                    requestTimeout: opts.clientWsRequestTimeout,
                    enableWss: opts.clientEnableWss,
                    wssCertPath: opts.clientWssCertPath,
                    wssKeyPath: opts.clientWssKeyPath,
                    wssCaPath: opts.clientWssCaPath,
                    listenGroup: opts.clientListenGroup,
                };
            },
        };
        const formatter = {
            "application/json": new codecs_1.Json(),
            "application/xml": new codecs_1.XML(),
            "application/kvp": new codecs_1.KV(opts.clientKvPairSeparator, opts.clientKvKeyValueSeparator, opts.clientKvIsStartSeparator, opts.clientKvIsEndSeparator),
            "application/msgpack": new codecs_1.MsgPack(),
        };
        if (opts.clientIsoConfigPath && fs_1.default.existsSync(opts.clientIsoConfigPath))
            formatter["application/iso8583"] = new codecs_1.ISO8583(opts.clientIsoConfigPath);
        return new WebScoketServer_1.WebSocketServer("client", parser, formatter).setLogPrefix("[Client][WsServer]");
    }
    getCallerTcpEndpoints() {
        const ids = [];
        const callerEndpoints = [];
        const { opts } = this;
        const { clientTcpCallerIp: ips, clientTcpCallerPort: ports, clientTcpCallerEnableTls: enableTls, clientTcpCallerGroups: groups, clientTcpCallerNames: names, clientTcpCallerTimeout: timeouts, clientTcpCallerReconnectTime: reconnectTimes, clientTcpCallerHeader: headers, clientTcpCallerHeaderLengthIncluded: headersLengthInc, clientTcpCallerTrailer: trailers, clientTcpCallerTrailerLengthIncluded: trailersLengthInc, clientTcpCallerAck: acks, clientTcpCallerNack: nacks, clientTcpCallerEot: eots, clientTcpCallerEnq: enqs, clientTcpCallerDataType: dataTypes, clientTcpCallerIsoConfigPath: isoConfigPaths, clientTcpCallerCrcPoly: crcPolies = [], clientTcpCallerCrcXorIn: crcXorIns = [], clientTcpCallerCrcXorOut: crcXorOuts = [], clientTcpCallerCrcReflect: crcReflects = [], clientTcpCallerPacketLengthIncluded: packetLenInc, clientTcpCallerPacketLengthType: packetLenType, clientTcpCallerPacketLengthFormat: packetLenFormat, clientTcpCallerPacketLengthOffset: packetLenOffset, clientTcpCallerPacketLengthFirst: packetLenFirst, clientTcpCallerPacketLengthLen: packetLenLen, clientTcpCallerEscapeChar: escapeChars, clientTcpCallerCheckSumType: checkSumTypes, clientTcpCallerTrailerBeforeCksum: trailerBeforeCksums, clientTcpCallerCheckSumLengthIncluded: checkSumLenIncs, clientTcpCallerIsHeaderIncludedInCkSum: isHeaderIncsInCkSums, clientTcpCallerIsTrailerIncludedInCkSum: isTrailerIncsInCkSums, } = opts;
        if (ports.length !== ips.length)
            throw new Error("The client tcp caller ports qty are not equal to ips qty");
        if (enableTls.length !== ips.length)
            throw new Error("The client tcp caller enableTls qty are not equal to ips qty");
        if (groups && groups.length !== ips.length)
            throw new Error("The client tcp caller groups qty are not equal to ips qty");
        if (names && names.length !== ips.length)
            throw new Error("The client tcp caller names qty are not equal to ips qty");
        if (timeouts.length !== ips.length)
            throw new Error("The client tcp caller timeouts qty are not equal to ips qty");
        if (reconnectTimes.length !== ips.length)
            throw new Error("The client tcp caller reconnectTimes qty are not equal to ips qty");
        if (headers.length !== ips.length)
            throw new Error("The client tcp caller headers qty are not equal to ips qty");
        if (headersLengthInc.length !== ips.length)
            throw new Error("The client tcp caller headersLengthInc qty are not equal to ips qty");
        if (trailers.length !== ips.length)
            throw new Error("The client tcp caller trailers qty are not equal to ips qty");
        if (trailersLengthInc.length !== ips.length)
            throw new Error("The client tcp caller trailersLengthInc qty are not equal to ips qty");
        if (acks.length !== ips.length)
            throw new Error("The client tcp caller acks qty are not equal to ips qty");
        if (nacks.length !== ips.length)
            throw new Error("The client tcp caller nacks qty are not equal to ips qty");
        if (eots.length !== ips.length)
            throw new Error("The client tcp caller eots qty are not equal to ips qty");
        if (enqs.length !== ips.length)
            throw new Error("The client tcp caller enqs qty are not equal to ips qty");
        if (dataTypes.length !== ips.length)
            throw new Error("The client tcp caller data types qty are not equal to ips qty");
        if (isoConfigPaths.length !== ips.length)
            throw new Error("The client tcp caller iso config paths qty are not equal to ips qty");
        if (crcPolies.length && crcPolies.length !== ips.length)
            throw new Error("The client tcp caller crcPolies qty are not equal to ips qty");
        if (crcXorIns.length && crcXorIns.length !== ips.length)
            throw new Error("The client tcp caller crcXorIns qty are not equal to ips qty");
        if (crcXorOuts.length && crcXorOuts.length !== ips.length)
            throw new Error("The client tcp caller crcXorOuts qty are not equal to ips qty");
        if (crcReflects.length && crcReflects.length !== ips.length)
            throw new Error("The client tcp caller crcReflects qty are not equal to ips qty");
        if (packetLenInc.length !== ips.length)
            throw new Error("The client tcp caller packet len inc qty are not equal to ips qty");
        if (packetLenType.length !== ips.length)
            throw new Error("The client tcp caller packet len type qty are not equal to ips qty");
        if (packetLenFormat.length !== ips.length)
            throw new Error("The client tcp caller packet len format qty are not equal to ips qty");
        if (packetLenOffset.length !== ips.length)
            throw new Error("The client tcp caller packet len offset qty are not equal to ips qty");
        if (packetLenFirst.length !== ips.length)
            throw new Error("The client tcp caller packet len first qty are not equal to ips qty");
        if (packetLenLen.length !== ips.length)
            throw new Error("The client tcp caller packet len len qty are not equal to ips qty");
        if (escapeChars.length !== ips.length)
            throw new Error("The client tcp caller escapeChars qty are not equal to ips qty");
        if (checkSumTypes.length !== ips.length)
            throw new Error("The client tcp caller checkSum types qty are not equal to ips qty");
        if (trailerBeforeCksums.length !== ips.length)
            throw new Error("The client tcp caller trailerBeforeChsums qty are not equal to ips qty");
        if (checkSumLenIncs.length !== ips.length)
            throw new Error("The client tcp caller checkSumLenIncs qty are not equal to ips qty");
        if (isHeaderIncsInCkSums.length !== ips.length)
            throw new Error("The client tcp caller isHeaderEncsInCkSums qty are not equal to ips qty");
        if (isTrailerIncsInCkSums.length !== ips.length)
            throw new Error("The client tcp caller isTrailerIncsInCkSums qty are not equal to ips qty");
        for (const num in ips) {
            const formatter = protocol_2.Formatter.get(dataTypes[num], {
                configFilePath: opts.clientIsoConfigPath,
                isEndSeperator: opts.clientKvIsEndSeparator,
                isStartSeparator: opts.clientKvIsStartSeparator,
                keyValueSeparator: opts.clientKvKeyValueSeparator,
                pairSeparator: opts.clientKvPairSeparator,
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
            const eot = new protocol_2.Eot(Buffer.from(eots[num], "hex"));
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
        const { clientHttpCallerIp: ips, clientHttpCallerPort: ports, clientHttpCallerPath: paths, clientHttpCallerEnableHttps: enableHttps, clientHttpCallerGroups: groups, clientHttpCallerNames: names, clientHttpCallerTimeout: timeouts, clientHttpCallerAuthKey: authKeys, clientHttpCallerRejectUnauthorized: rejUnauthorized, } = opts;
        const formatter = {
            "application/json": new codecs_1.Json(),
            "application/xml": new codecs_1.XML(),
            "application/kvp": new codecs_1.KV(opts.clientKvPairSeparator, opts.clientKvKeyValueSeparator, opts.clientKvIsStartSeparator, opts.clientKvIsEndSeparator),
            "application/msgpack": new codecs_1.MsgPack(),
        };
        if (opts.clientIsoConfigPath && fs_1.default.existsSync(opts.clientIsoConfigPath))
            formatter["application/iso8583"] = new codecs_1.ISO8583(opts.clientIsoConfigPath);
        if (ports.length !== ips.length)
            throw new Error("The client http caller ports qty are not equal to ips qty");
        if (enableHttps.length !== ips.length)
            throw new Error("The client http caller enableHttps qty are not equal to ips qty");
        if (paths.length !== ips.length)
            throw new Error("The client http caller paths qty are not equal to ips qty");
        if (groups && groups.length !== ips.length)
            throw new Error("The client http caller groups qty are not equal to ips qty");
        if (names && names.length !== ips.length)
            throw new Error("The client http caller names qty are not equal to ips qty");
        if (timeouts.length !== ips.length)
            throw new Error("The client http caller timeouts qty are not equal to ips qty");
        if (authKeys && authKeys.length !== ips.length)
            throw new Error("The client http caller authKeys qty are not equal to ips qty");
        if (rejUnauthorized.length !== ips.length)
            throw new Error("The client http caller rejUnauthorized qty are not equal to ips qty");
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
        const { clientSerialCallerBaudRate: baudRates, clientSerialCallerDataBits: dataBits, clientSerialCallerLock: locks, clientSerialCallerParity: parities, clientSerialCallerPort: ports, clientSerialCallerStopBits: stopBits, clientSerialCallerXoff: xoffs, clientSerialCallerXon: xons, clientSerialCallerGroups: groups, clientSerialCallerNames: names, clientSerialCallerTimeout: timeouts, clientSerialCallerReconnectTime: reconnectTimes, clientSerialCallerHeader: headers, clientSerialCallerHeaderLengthIncluded: headersLengthInc, clientSerialCallerTrailer: trailers, clientSerialCallerTrailerLengthIncluded: trailersLengthInc, clientSerialCallerAck: acks, clientSerialCallerNack: nacks, clientSerialCallerEot: eots, clientSerialCallerEnq: enqs, clientSerialCallerDataType: dataTypes, clientSerialCallerIsoConfigPath: isoConfigPaths, clientSerialCallerCrcPoly: crcPolies = [], clientSerialCallerCrcXorIn: crcXorIns = [], clientSerialCallerCrcXorOut: crcXorOuts = [], clientSerialCallerCrcReflect: crcReflects = [], clientSerialCallerPacketLengthIncluded: packetLenInc, clientSerialCallerPacketLengthType: packetLenType, clientSerialCallerPacketLengthFormat: packetLenFormat, clientSerialCallerPacketLengthOffset: packetLenOffset, clientSerialCallerPacketLengthFirst: packetLenFirst, clientSerialCallerPacketLengthLen: packetLenLen, clientSerialCallerEscapeChar: escapeChars, clientSerialCallerCheckSumType: checkSumTypes, clientSerialCallerTrailerBeforeCksum: trailerBeforeCksums, clientSerialCallerCheckSumLengthIncluded: checkSumLenIncs, clientSerialCallerIsHeaderIncludedInCkSum: isHeaderIncsInCkSums, clientSerialCallerIsTrailerIncludedInCkSum: isTrailerIncsInCkSums, } = opts;
        if (baudRates && baudRates.length !== ports.length)
            throw new Error("The client serial caller baudRates qty are not equal to ports qty");
        if (dataBits && dataBits.length !== ports.length)
            throw new Error("The client serial caller dataBits qty are not equal to ports qty");
        if (locks && locks.length !== ports.length)
            throw new Error("The client serial caller locks qty are not equal to ports qty");
        if (parities && parities.length !== ports.length)
            throw new Error("The client serial caller parities qty are not equal to ports qty");
        if (stopBits && stopBits.length !== ports.length)
            throw new Error("The client serial caller stopBits qty are not equal to ports qty");
        if (xoffs && xoffs.length !== ports.length)
            throw new Error("The client serial caller xoffs qty are not equal to ports qty");
        if (xons && xons.length !== ports.length)
            throw new Error("The client serial caller xons qty are not equal to ports qty");
        if (groups && groups.length !== ports.length)
            throw new Error("The client serial caller groups qty are not equal to ports qty");
        if (names && names.length !== ports.length)
            throw new Error("The client serial caller names qty are not equal to ports qty");
        if (timeouts.length !== ports.length)
            throw new Error("The client serial caller timeouts qty are not equal to ports qty");
        if (reconnectTimes.length !== ports.length)
            throw new Error("The client serial caller reconnectTimes qty are not equal to ports qty");
        if (headers.length !== ports.length)
            throw new Error("The client serial caller headers qty are not equal to ports qty");
        if (headersLengthInc.length !== ports.length)
            throw new Error("The client serial caller headersLengthInc qty are not equal to ports qty");
        if (trailers.length !== ports.length)
            throw new Error("The client serial caller trailers qty are not equal to ports qty");
        if (trailersLengthInc.length !== ports.length)
            throw new Error("The client serial caller trailersLengthInc qty are not equal to ports qty");
        if (acks.length !== ports.length)
            throw new Error("The client serial caller acks qty are not equal to ports qty");
        if (nacks.length !== ports.length)
            throw new Error("The client serial caller nacks qty are not equal to ports qty");
        if (eots.length !== ports.length)
            throw new Error("The client serial caller eots qty are not equal to ports qty");
        if (enqs.length !== ports.length)
            throw new Error("The client serial caller enqs qty are not equal to ports qty");
        if (dataTypes.length !== ports.length)
            throw new Error("The client serial caller data types qty are not equal to ports qty");
        if (isoConfigPaths.length !== ports.length)
            throw new Error("The client serial caller iso config paths qty are not equal to ports qty");
        if (crcPolies.length && crcPolies.length !== ports.length)
            throw new Error("The client serial caller crcPolies qty are not equal to ports qty");
        if (crcXorIns.length && crcXorIns.length !== ports.length)
            throw new Error("The client serial caller crcXorIns qty are not equal to ports qty");
        if (crcXorOuts.length && crcXorOuts.length !== ports.length)
            throw new Error("The client serial caller crcXorOuts qty are not equal to ports qty");
        if (crcReflects.length && crcReflects.length !== ports.length)
            throw new Error("The client serial caller crcReflects qty are not equal to ports qty");
        if (packetLenInc.length !== ports.length)
            throw new Error("The client serial caller packet len inc qty are not equal to ports qty");
        if (packetLenType.length !== ports.length)
            throw new Error("The client serial caller packet len type qty are not equal to ports qty");
        if (packetLenFormat.length !== ports.length)
            throw new Error("The client serial caller packet len format qty are not equal to ports qty");
        if (packetLenOffset.length !== ports.length)
            throw new Error("The client serial caller packet len offset qty are not equal to ports qty");
        if (packetLenFirst.length !== ports.length)
            throw new Error("The client serial caller packet len first qty are not equal to ports qty");
        if (packetLenLen.length !== ports.length)
            throw new Error("The client serial caller packet len len qty are not equal to ports qty");
        if (escapeChars.length !== ports.length)
            throw new Error("The client serial caller escapeChars qty are not equal to ports qty");
        if (checkSumTypes.length !== ports.length)
            throw new Error("The client serial caller checkSum types qty are not equal to ports qty");
        if (trailerBeforeCksums.length !== ports.length)
            throw new Error("The client serial caller trailerBeforeChsums qty are not equal to ports qty");
        if (checkSumLenIncs.length !== ports.length)
            throw new Error("The client serial caller checkSumLenIncs qty are not equal to ports qty");
        if (isHeaderIncsInCkSums.length !== ports.length)
            throw new Error("The client serial caller isHeaderEncsInCkSums qty are not equal to ports qty");
        if (isTrailerIncsInCkSums.length !== ports.length)
            throw new Error("The client serial caller isTrailerIncsInCkSums qty are not equal to ports qty");
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
                configFilePath: opts.clientIsoConfigPath,
                isEndSeperator: opts.clientKvIsEndSeparator,
                isStartSeparator: opts.clientKvIsStartSeparator,
                keyValueSeparator: opts.clientKvKeyValueSeparator,
                pairSeparator: opts.clientKvPairSeparator,
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
            const eot = new protocol_2.Eot(Buffer.from(eots[num], "hex"));
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
        const { controlMsgReloadFileMode, controlMsgReloadFileInterval, controlMsgsRulesFilePath } = AppPropsInstance_1.AppPropsInstance.getInstance().controlMsgs;
        const transformation = new TestMsgsBuilder_1.TestMsgsBuilder({
            transformFilePathList: controlMsgsRulesFilePath.split(","),
            reloadFileMode: controlMsgReloadFileMode,
            reloadFileInterval: controlMsgReloadFileInterval,
            applyDefaultRule: false,
            logPrefix: "[Client][TestMsgsBuilder]",
        });
        transformation.initLoad();
        const { clientTimerEchoTest, clientEchoTransformationRuleName, clientLogonTransformationRuleName } = this.opts;
        const directions = { send: MsgsTesterCreatorFileType_1.TesterDirectionsAvbEnum.TargetToClient, rcv: MsgsTesterCreatorFileType_1.TesterDirectionsAvbEnum.ClientToTarget };
        const controMsgs = {
            echo: new endpointTester_1.Echo(transformation, directions, clientEchoTransformationRuleName),
            logon: new endpointTester_1.LogOn(transformation, directions, clientLogonTransformationRuleName),
        };
        // Control Endpoints Tester
        const tester = new endpointTester_1.EndpointTester(controMsgs, clientTimerEchoTest);
        tester.setLogPrefix("[Client][EndpointTester]");
        return tester;
    }
    getAuthenticator() {
        const { authenticatorReloadFileMode, authenticatorRulesFilePath, authenticatorReloadFileInterval, authenticatorExtFunctionsFolderPath, } = AppPropsInstance_1.AppPropsInstance.getInstance().authenticator;
        const transformation = new AuthMsgsBuilder_1.AuthMsgsBuilder({
            transformFilePathList: authenticatorRulesFilePath.split(","),
            reloadFileMode: authenticatorReloadFileMode,
            reloadFileInterval: authenticatorReloadFileInterval,
            applyDefaultRule: false,
            logPrefix: "[Client][AuthMsgsBuilder]",
            extensionFunctionsFolderPath: authenticatorExtFunctionsFolderPath,
        });
        transformation.initLoad();
        const { clientHttpCallerReloadAuth, clientHttpCallerAuthRuleName } = this.opts;
        const directions = { send: AuthenticationMakerFileType_1.AuthDirectionsAvbEnum.Request, rcv: AuthenticationMakerFileType_1.AuthDirectionsAvbEnum.Response };
        const controMsgs = {
            tokenAuth: new msgTypes_1.Login(transformation, directions, clientHttpCallerAuthRuleName),
        };
        // Control Endpoints Tester
        const auth = new Authenticator_1.Authenticator(controMsgs, clientHttpCallerReloadAuth);
        auth.setLogPrefix("[Client][Authenticator]");
        return auth;
    }
}
exports.Client = Client;
