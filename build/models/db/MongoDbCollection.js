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
exports.MongoDbCollection = void 0;
let mongodb;
class MongoDbCollection {
    static isConnectionCreated(id) {
        return !!this.connections[id];
    }
    static getConnectionById(id) {
        if (!this.connections[id])
            throw new Error(`The connection id [${id}] is not created. Please set it before run the app.`);
        return this.connections[id];
    }
    static createConnection(id, options) {
        if (!mongodb)
            throw new Error(`You have to enable mongo db module first`);
        if (this.connections[id])
            throw new Error(`The id [${id}] has already been used. Choose another one.`);
        const { address, user, password, schemaName, minPool, maxPool } = options;
        const connection = new mongodb.MongoClient(`mongodb://${user}:${password}@${address}`, { minPoolSize: minPool, maxPoolSize: maxPool });
        connection
            .connect()
            .then((client) => {
            const dbClient = client.db(schemaName);
            this.connections[id].ready = true;
            this.connections[id].db = dbClient;
        })
            .catch((err) => {
            throw err;
        });
        this.connections[id] = { ready: false, db: null };
    }
    static getConnectionId(options) {
        const { dialect, address, user, schemaName } = options;
        return `${dialect}_${address}_${user}_${schemaName}`;
    }
}
exports.MongoDbCollection = MongoDbCollection;
MongoDbCollection.connections = {};
MongoDbCollection.logger = null;
MongoDbCollection.status = null;
MongoDbCollection.init = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongodb)
        mongodb = yield Promise.resolve().then(() => __importStar(require("mongodb")));
});
MongoDbCollection.initStatusLogger = (logger) => {
    if (!MongoDbCollection.status) {
        MongoDbCollection.logger = logger;
        MongoDbCollection.status = setInterval(() => {
            Object.keys(MongoDbCollection.connections).forEach(id => {
                const dbClient = MongoDbCollection.connections[id];
                if (dbClient.ready) {
                    MongoDbCollection.logger &&
                        MongoDbCollection.logger.trace(`[MongoDbCollection][ ${id} ] - ${dbClient.db.stats()}` // FIXME
                        );
                }
            });
        }, 30000);
    }
};
