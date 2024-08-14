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
exports.Pool = void 0;
const uuid = __importStar(require("uuid"));
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
const PoolModes_1 = require("./PoolModes");
const BalanceSort_1 = require("./sorters/BalanceSort");
class Pool {
    constructor(sendMode = PoolModes_1.PoolModes.balance) {
        this.sendMode = sendMode;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.logPrefix = `[Pool]${uuid.v1()}`;
        this.endpoints = {};
        this.setLogPrexis = (logPrefixNew) => {
            this.logPrefix = logPrefixNew;
            return this;
        };
        this.cleanDeadEndpoints = () => {
            this.logger.trace(`Start cleaning disconnected endpoint from this pool`, { logPrefix: this.logPrefix });
            for (const groupId in this.endpoints)
                this.endpoints[groupId] = this.endpoints[groupId].filter(({ isPermanent, isConnected }) => isPermanent || isConnected);
            this.logger.trace(`End cleaning disconnected endpoint from this pool`, { logPrefix: this.logPrefix });
        };
        setInterval(this.cleanDeadEndpoints, 20000);
    }
    addEndpoint(connection, groupID = "-1") {
        const group = this.endpoints[groupID] || [];
        group.push(connection);
        this.endpoints[groupID] = group;
        this.logger.trace(`New endpoint with id ${connection.id} added to the pool. GroupID: [${groupID}] - Length: [${group.length}]`, {
            logPrefix: this.logPrefix,
        });
    }
    getEndpoint(groupID) {
        let chosenEndpoint, endpointsGroup = this.endpoints[groupID];
        if (!endpointsGroup)
            throw new Error(`Group ID not found: ${groupID}`);
        if (this.sendMode === PoolModes_1.PoolModes.balance) {
            endpointsGroup = BalanceSort_1.BalanceSort.sort(endpointsGroup.slice(0));
        }
        for (const endpoint of endpointsGroup) {
            if (endpoint.isConnected) {
                chosenEndpoint = endpoint;
                break;
            }
        }
        if (chosenEndpoint) {
            return chosenEndpoint;
        }
        else {
            throw new Error(`No target connected in this group. GroupID: [${groupID}]`);
        }
    }
    isAnyoneAvailable(groupID) {
        const group = this.endpoints[groupID] || [];
        return group.some(({ isConnected }) => isConnected);
    }
}
exports.Pool = Pool;
