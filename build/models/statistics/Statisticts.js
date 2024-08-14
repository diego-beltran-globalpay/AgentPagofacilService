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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stadistics = void 0;
const os_1 = __importDefault(require("os"));
const uuid = __importStar(require("uuid"));
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
const initialState = {
    name: "",
    startDateTime: new Date(),
    lastUpdateDateTime: new Date(),
    pid: 0,
    usedMemory: 0,
    availableMemory: 0,
    loadAverage_1Min: 0,
    loadAverage_5Min: 0,
    loadAverage_15Min: 0,
    endpoints: {},
};
class Stadistics {
    constructor() {
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[Stadistics][${uuid.v1()}]`;
        this.data = initialState;
        this.endpoints = {};
        this.setLogPrefix = (logPrefixNew) => {
            this.logPrefix = logPrefixNew;
            return this;
        };
        setInterval(() => {
            this.cleanDeadEndpoints();
            this.update();
        }, 20000);
    }
    update() {
        const { logPrefix } = this;
        const execLogPrefix = `${logPrefix}[${uuid.v1()}]`;
        const memoryStatus = process.memoryUsage();
        const average = os_1.default.loadavg();
        this.data = Object.assign(Object.assign({}, this.data), { pid: process.pid, usedMemory: memoryStatus.heapUsed, availableMemory: memoryStatus.heapTotal, loadAverage_1Min: average[0], loadAverage_5Min: average[1], loadAverage_15Min: average[2] });
        const endpointsStats = {};
        for (const groupName in this.endpoints) {
            const group = this.endpoints[groupName];
            endpointsStats[groupName] = [];
            for (const elementId in group) {
                const { isConnected, isPermanent, internalID, id, stats } = group[elementId];
                if (isConnected || isPermanent)
                    endpointsStats[groupName].push(Object.assign({ isConnected,
                        internalID,
                        id }, stats));
                else
                    delete group[elementId];
            }
        }
        this.data.endpoints = endpointsStats;
        this.logger.trace(`Status: ${JSON.stringify(this.data)}`, { logPrefix: execLogPrefix });
    }
    addEndpoint(groupName, endpoint) {
        const group = this.endpoints[groupName] || {};
        group[endpoint.internalID] = endpoint;
        this.endpoints[groupName] = group;
    }
    deleteEndpoint({ internalID }) {
        delete this.endpoints[internalID];
    }
    cleanDeadEndpoints() {
        for (const groupName in this.endpoints) {
            const group = this.endpoints[groupName];
            for (const id in group) {
                if (!(group[id].isConnected || group[id].isPermanent))
                    delete group[id];
            }
        }
    }
}
exports.Stadistics = Stadistics;
