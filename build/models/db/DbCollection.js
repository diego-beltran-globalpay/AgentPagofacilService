"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbCollection = void 0;
const KnexContextWrapper_1 = require("../contexts/database/wrappers/KnexContextWrapper");
const KnexDbCollection_1 = require("./KnexDbCollection");
const MongoContextWrapper_1 = require("../contexts/database/wrappers/MongoContextWrapper");
const MongoDbCollection_1 = require("./MongoDbCollection");
class DbCollection {
    static isConnectionCreated(id) {
        return KnexDbCollection_1.KnexDbCollection.isConnectionCreated(id) || MongoDbCollection_1.MongoDbCollection.isConnectionCreated(id);
    }
    static getRawConnectionById(id) {
        if (KnexDbCollection_1.KnexDbCollection.connections[id])
            return KnexDbCollection_1.KnexDbCollection.connections[id];
        if (MongoDbCollection_1.MongoDbCollection.connections[id])
            return MongoDbCollection_1.MongoDbCollection.connections[id];
        throw new Error(`The connection id [${id}] is not created. Please set it before run the app.`);
    }
    static getWrappedConnectionById(id) {
        if (DbCollection.wrappedConnections[id])
            return DbCollection.wrappedConnections[id];
        if (KnexDbCollection_1.KnexDbCollection.connections[id])
            DbCollection.wrappedConnections[id] = new KnexContextWrapper_1.KnexContextWrapper(KnexDbCollection_1.KnexDbCollection.connections[id]);
        if (MongoDbCollection_1.MongoDbCollection.connections[id])
            DbCollection.wrappedConnections[id] = new MongoContextWrapper_1.MongoContextWrapper(MongoDbCollection_1.MongoDbCollection.connections[id]);
        if (DbCollection.wrappedConnections[id])
            return DbCollection.wrappedConnections[id];
        throw new Error(`The connection id [${id}] is not created. Please set it before run the app.`);
    }
}
exports.DbCollection = DbCollection;
DbCollection.wrappedConnections = {};
DbCollection.getRawConnections = () => {
    return Object.assign(Object.assign({}, KnexDbCollection_1.KnexDbCollection.connections), MongoDbCollection_1.MongoDbCollection.connections);
};
