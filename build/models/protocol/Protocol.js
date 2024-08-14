"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocol = void 0;
const uuid = __importStar(require("uuid"));
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
const Events_1 = require("../Events");
const Message_1 = require("../messages/Message");
class Protocol extends Events_1.Events {
    constructor(formatter, packetLength, header, trailer, checkSum, escape, ack, nack, enq, eot, options) {
        super({ newPacket: [], sendAck: [], sendNack: [], sendEot: [], rcvEnq: [], rcvAck: [], rcvNack: [] });
        this.formatter = formatter;
        this.packetLength = packetLength;
        this.header = header;
        this.trailer = trailer;
        this.checkSum = checkSum;
        this.escape = escape;
        this.ack = ack;
        this.nack = nack;
        this.enq = enq;
        this.eot = eot;
        this.options = options;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.id = uuid.v1();
        this.tmpProps = this.restartTmpProps();
    }
    setId(id) {
        this.id = id;
    }
    restartTmpProps() {
        this.logger.trace(`[ Protocol ] - Restarting protocol tmp variables`, { logPrefix: this.id });
        this.tmpProps = {
            startLength: this.header.length + this.options.packetLengthOffset + this.packetLength.length,
            offsetAll: this.header.length + this.options.packetLengthOffset,
            includedAll: (this.options.headerLengthIncluded ? this.header.length : 0) +
                (this.options.trailerLengthIncluded ? this.trailer.length : 0) +
                (this.options.checkSumLengthIncluded ? this.checkSum.length : 0) +
                this.options.packetLengthOffset,
            extraDataLength: this.header.length + this.trailer.length + this.checkSum.length + this.options.packetLengthOffset + this.packetLength.length,
            accumulatingBuffer: Buffer.alloc(0),
            totalPacketLen: -1,
            accumulatingLen: 0,
            recvedThisTimeLen: 0,
        };
        return this.tmpProps;
    }
    getMsgToSend(message) {
        const { messageID } = message;
        const { trailerLengthIncluded, headerLengthIncluded, checkSumLengthIncluded, packetLengthOffset, packetLengthFirst } = this.options;
        const msgFormatted = this.formatter.encode(message);
        const ckSumPacketToApplyBuff = this.getDataToApplyCkSum(msgFormatted, this.header.value, this.trailer.value);
        const ckSumValue = Buffer.from(this.checkSum.calculate(ckSumPacketToApplyBuff), "hex");
        const msgToSend = Buffer.alloc(msgFormatted.length + this.header.length + this.trailer.length + this.checkSum.length + packetLengthOffset + this.packetLength.length);
        const packetLength = msgFormatted.length +
            (trailerLengthIncluded ? this.trailer.length : 0) +
            (headerLengthIncluded ? this.header.length : 0) +
            (checkSumLengthIncluded ? this.checkSum.length : 0);
        this.logger.trace(`[ Protocol ][ Send ] - PacketLengthOffset: ${packetLengthOffset}`, { messageID });
        this.logger.trace(`[ Protocol ][ Send ] - Data Len: ${msgFormatted.length}`, { messageID });
        this.logger.trace(`[ Protocol ][ Send ] - Calculated PacketLen: ${packetLength}`, { messageID });
        this.logger.trace(`[ Protocol ][ Send ] - Buffer Len: ${msgToSend.length}`, { messageID });
        let bufferPos = 0;
        if (!packetLengthFirst) {
            this.header.value.copy(msgToSend, bufferPos);
            this.logger.trace(`[ Protocol ][ Send ] - Header written: ${msgToSend.toString("hex")}`, { messageID });
            bufferPos += this.header.length + packetLengthOffset;
            this.packetLength.write(msgToSend, packetLength, bufferPos);
            this.logger.trace(`[ Protocol ][ Send ] - Length written: ${msgToSend.toString("hex")}`, { messageID });
            bufferPos += this.packetLength.length;
        }
        else {
            this.packetLength.write(msgToSend, packetLength, bufferPos);
            this.logger.trace(`[ Protocol ][ Send ] - Length written: ${msgToSend.toString("hex")}`, { messageID });
            bufferPos += this.packetLength.length;
            this.header.value.copy(msgToSend, bufferPos);
            this.logger.trace(`[ Protocol ][ Send ] - Header written: ${msgToSend.toString("hex")}`, { messageID });
            bufferPos += this.header.length + packetLengthOffset;
        }
        msgFormatted.copy(msgToSend, bufferPos);
        this.logger.trace(`[ Protocol ][ Send ] - Data written: ${msgToSend.toString("hex")}`, { messageID });
        bufferPos += msgFormatted.length;
        if (this.options.trailerBeforeCksum) {
            this.trailer.value.copy(msgToSend, bufferPos);
            this.logger.trace(`[ Protocol ][ Send ] - Trailer written: ${msgToSend.toString("hex")}`, { messageID });
            bufferPos += this.trailer.length;
            ckSumValue.copy(msgToSend, bufferPos);
            this.logger.trace(`[ Protocol ][ Send ] - CkSum written: ${msgToSend.toString("hex")}`, { messageID });
        }
        else {
            ckSumValue.copy(msgToSend, bufferPos);
            this.logger.trace(`[ Protocol ][ Send ] - CkSum written: ${msgToSend.toString("hex")}`, { messageID });
            bufferPos += this.checkSum.length;
            this.trailer.value.copy(msgToSend, bufferPos);
            this.logger.trace(`[ Protocol ][ Send ] - Trailer written: ${msgToSend.toString("hex")}`, { messageID });
        }
        this.logger.debug(`[ Protocol ][ Send ] - Msg to send: ${msgToSend.toString("hex")}`, { messageID });
        return msgToSend;
    }
    addData(data) {
        const logger = this.logger;
        const { isHeaderIncludedInCkSum, isTrailerIncludedInCkSum, packetLengthFirst } = this.options;
        const { includedAll, offsetAll, startLength, extraDataLength } = this.tmpProps;
        logger.debug("[ Protocol ] - Data received");
        this.tmpProps.recvedThisTimeLen = data.length;
        logger.trace(`[ Protocol ] - recivedThisTimeLen=${this.tmpProps.recvedThisTimeLen}`);
        if (this.handleCommMsgs(data))
            return false;
        const tmpBuffer = Buffer.alloc(this.tmpProps.accumulatingLen + this.tmpProps.recvedThisTimeLen);
        this.tmpProps.accumulatingBuffer.copy(tmpBuffer);
        data.copy(tmpBuffer, this.tmpProps.accumulatingLen);
        this.tmpProps.accumulatingBuffer = tmpBuffer;
        this.tmpProps.accumulatingLen += this.tmpProps.recvedThisTimeLen;
        logger.trace(`[ Protocol ] - accumulatingLen=${this.tmpProps.accumulatingLen}`);
        if (this.tmpProps.accumulatingLen < this.header.length) {
            logger.trace("[ Protocol ] - need to get more data(less than header received) -> wait.");
            return false;
        }
        else if (this.tmpProps.accumulatingLen < startLength) {
            logger.trace("[ Protocol ] - need to get more data(less than header and length received) -> wait.");
            return false;
        }
        else if (this.tmpProps.accumulatingLen == startLength) {
            logger.trace("[ Protocol ] - need to get more data(only header and length is available) -> wait..");
            return false;
        }
        else {
            logger.trace(`[ Protocol ] - before-totalPacketLen=${this.tmpProps.totalPacketLen}`);
            if (this.tmpProps.totalPacketLen < 0) {
                // Si los digitos correspondiente a la longitud del paquete se encuentran sumados dentro de la longitud propia del paquete, deben quitarse
                this.tmpProps.totalPacketLen = this.packetLength.read(this.tmpProps.accumulatingBuffer, packetLengthFirst ? 0 : offsetAll) - includedAll;
                logger.trace(`[ Protocol ] - totalPacketLen=${this.tmpProps.totalPacketLen}`);
            }
        }
        while (this.tmpProps.accumulatingLen >= this.tmpProps.totalPacketLen + extraDataLength) {
            const packetHeaderBuffer = Buffer.alloc(this.header.length);
            const packetTrailerBuffer = Buffer.alloc(this.trailer.length);
            const packetDataBuffer = Buffer.alloc(this.tmpProps.totalPacketLen);
            const packetChkBuffer = Buffer.alloc(this.checkSum.length);
            this.tmpProps.accumulatingBuffer.copy(packetHeaderBuffer, 0, 0);
            this.tmpProps.accumulatingBuffer.copy(packetDataBuffer, 0, offsetAll + this.packetLength.length);
            const lengthToAfterData = offsetAll + this.packetLength.length + this.tmpProps.totalPacketLen;
            if (this.options.trailerBeforeCksum) {
                this.tmpProps.accumulatingBuffer.copy(packetTrailerBuffer, 0, lengthToAfterData);
                this.tmpProps.accumulatingBuffer.copy(packetChkBuffer, 0, lengthToAfterData + this.trailer.length);
            }
            else {
                this.tmpProps.accumulatingBuffer.copy(packetChkBuffer, 0, lengthToAfterData);
                this.tmpProps.accumulatingBuffer.copy(packetTrailerBuffer, 0, lengthToAfterData + this.checkSum.length);
            }
            const message = new Message_1.Message(packetDataBuffer);
            const { messageID } = message;
            logger.trace(`[ Protocol ] - PacketHeaderBuffer=[${packetHeaderBuffer.toString("hex")}]. Len=${packetHeaderBuffer.length}`, {
                messageID,
            });
            logger.trace(`[ Protocol ] - PacketTrailerBuffer=[${packetTrailerBuffer.toString("hex")}]. Len=${packetTrailerBuffer.length}`, {
                messageID,
            });
            logger.trace(`[ Protocol ] - PacketDataBuffer=[${packetDataBuffer.toString("hex")}]. Len=${packetDataBuffer.length}`, {
                messageID,
            });
            logger.trace(`[ Protocol ] - PacketCheckSumBuffer=[${packetChkBuffer.toString("hex")}]. Len=${packetChkBuffer.length}`, {
                messageID,
            });
            // Limpiamos las variables usadas para la recepcion, en este momento, para evitar que se reutilice esta trama en lugar de una nueva que puede llegar mientras procesamos la prime
            const newBufRebuild = Buffer.alloc(this.tmpProps.accumulatingBuffer.length);
            newBufRebuild.fill(0);
            this.tmpProps.accumulatingBuffer.copy(newBufRebuild, 0, this.tmpProps.totalPacketLen + extraDataLength, this.tmpProps.accumulatingBuffer.length);
            this.tmpProps.accumulatingLen -= this.tmpProps.totalPacketLen + extraDataLength;
            this.tmpProps.accumulatingBuffer = newBufRebuild;
            this.tmpProps.totalPacketLen = -1;
            logger.trace(`[ Protocol ] - Init:  accumulatingLen=${this.tmpProps.accumulatingLen}`, { messageID });
            const ckSumPacketToApplyBuff = this.getDataToApplyCkSum(packetDataBuffer, packetHeaderBuffer, packetTrailerBuffer);
            logger.trace(`[ Protocol ] - Calculating checksum on: [${ckSumPacketToApplyBuff.toString("hex")}]`, { messageID });
            const localCheckSum = this.checkSum.calculate(ckSumPacketToApplyBuff);
            const rcvCheckSum = packetChkBuffer.toString("hex");
            logger.trace(`[ Protocol ] - RcvCheckSum: [${rcvCheckSum}] - CalculatedCheckSum: [${localCheckSum}]`, { messageID });
            if (rcvCheckSum === localCheckSum) {
                logger.trace("[ Protocol ] - New raw body received", { messageID });
                this.formatter.decode(message);
                if (this.ack.length)
                    this.trigger("sendAck", this.ack);
                this.trigger("newPacket", message);
            }
            else {
                logger.warn("[ Protocol ] - The received checksum is not equal to the one we calculated.", { messageID });
                if (this.nack.length)
                    this.trigger("sendNack", this.nack);
            }
            if (this.tmpProps.accumulatingLen <= startLength) {
                logger.trace("[ Protocol ] - accumulatingLen <= packetHeaderLen", { messageID });
                return false;
            }
            else {
                this.tmpProps.totalPacketLen = this.packetLength.read(this.tmpProps.accumulatingBuffer, offsetAll);
                logger.trace(`[ Protocol ] - totalPacketLen=${this.tmpProps.totalPacketLen}`, { messageID });
            }
        }
    }
    getDataToApplyCkSum(packetDataBuffer, packetHeaderBuffer, packetTrailerBuffer) {
        const { isHeaderIncludedInCkSum, isTrailerIncludedInCkSum } = this.options;
        const ckSumPacketToApplyLen = packetDataBuffer.length + (isHeaderIncludedInCkSum ? packetHeaderBuffer.length : 0) + (isTrailerIncludedInCkSum ? packetTrailerBuffer.length : 0);
        const ckSumPacketToApplyBuff = Buffer.alloc(ckSumPacketToApplyLen);
        if (isHeaderIncludedInCkSum)
            packetHeaderBuffer.copy(ckSumPacketToApplyBuff, 0);
        if (isTrailerIncludedInCkSum)
            packetTrailerBuffer.copy(ckSumPacketToApplyBuff, (isHeaderIncludedInCkSum ? packetHeaderBuffer.length : 0) + packetDataBuffer.length);
        packetDataBuffer.copy(ckSumPacketToApplyBuff, isHeaderIncludedInCkSum ? packetHeaderBuffer.length : 0);
        return ckSumPacketToApplyBuff;
    }
    handleCommMsgs(data) {
        const logger = this.logger;
        const hexData = data.toString("hex");
        if (this.ack.length && this.ack.value.toString("hex") === hexData) {
            logger.trace(`[ Protocol ] - ACK rcv`);
            this.trigger("rcvAck", this.ack);
            return true;
        }
        else if (this.enq.length && this.enq.value.toString("hex") === hexData) {
            logger.trace(`[ Protocol ] - ENQ rcv`);
            this.trigger("rcvEnq", this.enq);
            return true;
        }
        else if (this.nack.length && this.nack.value.toString("hex") === hexData) {
            logger.trace(`[ Protocol ] - NACK rcv`);
            this.trigger("rcvNack", this.enq);
            return true;
        }
        return false;
    }
}
exports.Protocol = Protocol;
