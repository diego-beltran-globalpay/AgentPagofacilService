"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnexContextWrapper = void 0;
const LoggersColletion_1 = require("../../../../modules/logger/LoggersColletion");
class KnexContextWrapper {
    constructor(connection) {
        this.connection = connection;
        this.execStoreProcedure = (name, timeout, key, fields, logPrefix) => {
            const logger = LoggersColletion_1.LoggerInstance.getInstance();
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            const query = this.connection.db.raw(`CALL ${name} ( ${key ? `'${key}'` : ""} ${fields ? `, '${fields.join("','")}'` : ""} )`);
            logger.trace(`SQL Query: [${query.toString()}]`, { logPrefix });
            return query.timeout(timeout);
        };
        this.addEntry = (tableName, idFieldName, timeout, key, fields, logPrefix) => {
            const logger = LoggersColletion_1.LoggerInstance.getInstance();
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            const query = this.connection
                .db(tableName)
                .insert(Object.assign({ [idFieldName]: key }, fields))
                .onConflict(idFieldName)
                .merge();
            logger.trace(`SQL Query: [${query.toString()}]`, { logPrefix });
            return query.timeout(timeout);
        };
        this.updateEntry = (tableName, idFieldName, timeout, key, fields, logPrefix) => {
            const logger = LoggersColletion_1.LoggerInstance.getInstance();
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            const query = this.connection
                .db(tableName)
                .update(Object.assign({}, fields))
                .where({ [idFieldName]: key });
            logger.trace(`SQL Query: [${query.toString()}]`, { logPrefix });
            return query.timeout(timeout);
        };
        this.getEntry = (tableName, idFieldName, timeout, key, logPrefix) => {
            const logger = LoggersColletion_1.LoggerInstance.getInstance();
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            const query = this.connection
                .db(tableName)
                .select()
                .where({ [idFieldName]: key });
            logger.trace(`SQL Query: [${query.toString()}]`, { logPrefix });
            return query.timeout(timeout);
        };
        this.getAll = (tableName, timeout, logPrefix) => {
            const logger = LoggersColletion_1.LoggerInstance.getInstance();
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            const query = this.connection.db(tableName).select();
            logger.trace(`SQL Query: [${query.toString()}]`, { logPrefix });
            return query.timeout(timeout);
        };
        this.deleteEntry = (tableName, idFieldName, timeout, key, logPrefix) => {
            const logger = LoggersColletion_1.LoggerInstance.getInstance();
            if (!this.connection.ready)
                throw new Error("The db connection is not ready yet.");
            const query = this.connection
                .db(tableName)
                .del()
                .where({ [idFieldName]: key });
            logger.trace(`SQL Query: [${query.toString()}]`, { logPrefix });
            return query.timeout(timeout);
        };
    }
}
exports.KnexContextWrapper = KnexContextWrapper;
