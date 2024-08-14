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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialCallerEndpoint = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
const SerialEndpoint_1 = require("./SerialEndpoint");
const Timer_1 = require("../../Timer");
const Endpoint_1 = require("../Endpoint");
let serialport;
class SerialCallerEndpoint extends SerialEndpoint_1.SerialEndpoint {
    constructor(port, opts, timeout, reconnectTime, protocol) {
        super(protocol);
        this.port = port;
        this.opts = opts;
        this.timeout = timeout;
        this.reconnectTime = reconnectTime;
        this.protocol = protocol;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[SerialCallerEndpoint][${this.id}]`;
        this.type = Endpoint_1.EndpointsTypes.SerialCaller;
        this.reconnect = () => {
            this.reconnectTimer.clear();
            if (!this.isConnected) {
                this.logger.info(`Trying to connect again`, { logPrefix: this.logPrefix });
                this.connect(true);
            }
        };
        this.connect = (reconnect) => {
            this.protocol.restartTmpProps();
            const callback = error => {
                if (reconnect)
                    this.trigger("reconnectConnection");
                if (!error) {
                    this.isConnected = true;
                    this.logger.info(`Serial Enpoint connected. Timeout: ${this.timeout}`, { logPrefix: this.logPrefix });
                }
            };
            const connection = new serialport(this.port, this.opts);
            this.setConnection(connection);
            connection.open(callback);
        };
        this.init = () => {
            if (!serialport)
                throw new Error(`You have to enable serialport module first`);
            this.on("closeConnection", () => {
                if (this.reconnectTimer.cleared) {
                    this.reconnectTimer.set();
                }
            });
        };
        const { logPrefix } = this;
        this.logger.trace(`Serial Active Enpoint created. Timeout: ${timeout}`, { logPrefix });
        this.isPermanent = true;
        this.reconnectTimer = new Timer_1.Timer(this.reconnect, this.reconnectTime);
        this.init();
    }
}
exports.SerialCallerEndpoint = SerialCallerEndpoint;
SerialCallerEndpoint.init = () => __awaiter(void 0, void 0, void 0, function* () {
    serialport = !serialport ? yield Promise.resolve().then(() => __importStar(require("serialport"))) : serialport;
});
SerialCallerEndpoint.isInstanceOf = (obj) => obj.type === Endpoint_1.EndpointsTypes.SerialCaller;
