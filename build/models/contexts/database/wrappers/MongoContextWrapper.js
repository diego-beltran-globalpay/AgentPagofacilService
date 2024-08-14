"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoContextWrapper = void 0;
class MongoContextWrapper {
    constructor(connection) {
        this.connection = connection;
        this.execStoreProcedure = (storeProcedure, timeout, logPrefix) => {
            throw new Error("Store procedure feature is not implemented on mongo db connections");
        };
        this.addEntry = (tableName, idFieldName, timeout, key, fields, logPrefix) => {
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            return this.connection.db.collection(tableName).updateMany({ [idFieldName]: key }, { $set: Object.assign({}, fields) }, { upsert: true });
        };
        this.updateEntry = (tableName, idFieldName, timeout, key, fields, logPrefix) => {
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            return this.connection.db.collection(tableName).updateMany({ [idFieldName]: key }, { $set: Object.assign({}, fields) });
        };
        this.getEntry = (tableName, idFieldName, timeout, key, logPrefix) => {
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            return this.connection.db
                .collection(tableName)
                .find({ [idFieldName]: key })
                .toArray();
        };
        this.getAll = (tableName, timeout, logPrefix) => {
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            return this.connection.db.collection(tableName).find({}).toArray();
        };
        this.deleteEntry = (tableName, idFieldName, timeout, key, logPrefix) => {
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            return this.connection.db.collection(tableName).deleteMany({ [idFieldName]: key });
        };
    }
}
exports.MongoContextWrapper = MongoContextWrapper;
