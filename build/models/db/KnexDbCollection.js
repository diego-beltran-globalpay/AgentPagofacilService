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
exports.KnexDbCollection = void 0;
let knex;
class KnexDbCollection {
    static isConnectionCreated(id) {
        return !!this.connections[id];
    }
    static getConnectionById(id) {
        if (!this.connections[id])
            throw new Error(`The connection id [${id}] is not created. Please set it before run the app.`);
        return this.connections[id];
    }
    static createConnection(id, options) {
        if (!knex)
            throw new Error(`You have to enable db module first`);
        if (this.connections[id])
            throw new Error(`The id [${id}] has already been used. Choose another one.`);
        const { dialect, address, user, password, schemaName, minPool, maxPool, acquireTimeout } = options;
        const connection = knex({
            client: dialect,
            connection: {
                host: address,
                user: user,
                password: password,
                database: schemaName,
            },
            pool: { min: minPool, max: maxPool },
            acquireConnectionTimeout: acquireTimeout,
        });
        this.connections[id] = { ready: true, db: connection };
    }
    static getConnectionId(options) {
        const { dialect, address, user, schemaName } = options;
        return `${dialect}_${address}_${user}_${schemaName}`;
    }
}
exports.KnexDbCollection = KnexDbCollection;
KnexDbCollection.connections = {};
KnexDbCollection.logger = null;
KnexDbCollection.status = null;
KnexDbCollection.init = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!knex) {
        const module = yield Promise.resolve().then(() => __importStar(require("knex")));
        ({ knex } = module);
    }
});
KnexDbCollection.initStatusLogger = (logger) => {
    if (!KnexDbCollection.status) {
        KnexDbCollection.logger = logger;
        KnexDbCollection.status = setInterval(() => {
            Object.keys(KnexDbCollection.connections).forEach(id => {
                const connection = KnexDbCollection.connections[id];
                if (connection.ready) {
                    const { db: { client }, } = connection;
                    KnexDbCollection.logger &&
                        KnexDbCollection.logger.trace(`[DbCollection][ ${id} ] - InUse: ${client.pool.numUsed()} - Free: ${client.pool.numFree()} - PendingToAcquires: ${client.pool.numPendingAcquires()} - PendingToCreating: ${client.pool.numPendingCreates()}`);
                }
            });
        }, 30000);
    }
};
