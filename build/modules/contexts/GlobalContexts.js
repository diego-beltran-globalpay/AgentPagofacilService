"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalContexts = void 0;
const AppPropsInstance_1 = require("../properties/AppPropsInstance");
const contexts_1 = require("../../models/contexts");
class GlobalContexts {
    static initiateCtxs() {
        const { memcachedCtxAddresses, memcachedCtxIds } = AppPropsInstance_1.AppPropsInstance.getInstance().memcachedCtx;
        if (memcachedCtxAddresses && memcachedCtxIds) {
            if (memcachedCtxAddresses.length !== memcachedCtxIds.length)
                throw new Error("The memcached ctx addresses qty must be equal to the ids qty");
            memcachedCtxIds.forEach((id, index) => {
                const address = memcachedCtxAddresses[index];
                if (!address || !id)
                    throw new Error(`The memcached ctx address and/or id [${index}] cannot be empty`);
                contexts_1.MemcachedCtxsCollection.createInstance(id, memcachedCtxAddresses[index]);
            });
        }
        const { databaseCtxIds, databaseCtxConnectionIds, databaseCtxTables, databaseCtxTimeouts, databaseCtxMode, databaseCtxIdFieldNames, databaseCtxValueFieldNames, } = AppPropsInstance_1.AppPropsInstance.getInstance().databaseCtx;
        if (databaseCtxIds) {
            if (!databaseCtxConnectionIds || databaseCtxConnectionIds.length !== databaseCtxIds.length)
                throw new Error("The database ctx addresses qty must be equal to the ids qty");
            if (!databaseCtxMode || databaseCtxMode.length !== databaseCtxIds.length)
                throw new Error("The database ctx operation mode qty must be equal to the ids qty");
            if (!databaseCtxIdFieldNames || databaseCtxIdFieldNames.length !== databaseCtxIds.length)
                throw new Error("The database ctx id field names qty must be equal to the ids qty");
            if (!databaseCtxTables || databaseCtxTables.length !== databaseCtxIds.length)
                throw new Error("The database ctx table names qty must be equal to the ids qty");
            if (databaseCtxTimeouts && databaseCtxTimeouts.length !== databaseCtxIds.length)
                throw new Error("The database ctx timeouts qty must be equal to the ids qty");
            if (databaseCtxValueFieldNames && databaseCtxValueFieldNames.length !== databaseCtxIds.length)
                throw new Error("The database ctx value field names qty must be equal to the ids qty");
            if (databaseCtxValueFieldNames && databaseCtxValueFieldNames.length !== databaseCtxIds.length)
                throw new Error("The database ctx value field names qty must be equal to the ids qty");
            if (databaseCtxValueFieldNames && databaseCtxValueFieldNames.length !== databaseCtxIds.length)
                throw new Error("The database ctx value field names qty must be equal to the ids qty");
            if (databaseCtxValueFieldNames && databaseCtxValueFieldNames.length !== databaseCtxIds.length)
                throw new Error("The database ctx value field names qty must be equal to the ids qty");
            databaseCtxIds.forEach((id, index) => {
                contexts_1.DatabaseCtxsCollection.createInstance(id, {
                    connectionId: databaseCtxConnectionIds[index],
                    tableName: databaseCtxTables[index],
                    mode: databaseCtxMode[index],
                    idFieldName: databaseCtxIdFieldNames[index],
                    valueFieldName: databaseCtxValueFieldNames ? databaseCtxValueFieldNames[index] : undefined,
                    timeout: databaseCtxTimeouts ? databaseCtxTimeouts[index] : 60000,
                });
            });
        }
        const { databaseSpCtxIds, databaseSpCtxConnectionIds, databaseSpCtxTimeouts, databaseSpCtxMode, databaseSpCtxValueFieldNames, databaseSpCtxDeleteStoredProcNames, databaseSpCtxInsertStoredProcNames, databaseSpCtxSelectStoredProcNames, databaseSpCtxUpdateStoredProcNames, databaseSpCtxIdFieldNames, databaseSpCtxSelectAllStoredProcNames, } = AppPropsInstance_1.AppPropsInstance.getInstance().databaseSpCtx;
        if (databaseSpCtxIds) {
            if (!databaseSpCtxConnectionIds || databaseSpCtxConnectionIds.length !== databaseSpCtxIds.length)
                throw new Error("The database ctx addresses qty must be equal to the ids qty");
            if (!databaseSpCtxMode || databaseSpCtxMode.length !== databaseSpCtxIds.length)
                throw new Error("The database ctx operation mode qty must be equal to the ids qty");
            if (!databaseSpCtxIdFieldNames || databaseSpCtxIdFieldNames.length !== databaseSpCtxIds.length)
                throw new Error("The database ctx id field names qty must be equal to the ids qty");
            if (!databaseSpCtxDeleteStoredProcNames || databaseSpCtxDeleteStoredProcNames.length !== databaseSpCtxIds.length)
                throw new Error("The database ctx timeouts qty must be equal to the ids qty");
            if (!databaseSpCtxInsertStoredProcNames || databaseSpCtxInsertStoredProcNames.length !== databaseSpCtxIds.length)
                throw new Error("The database ctx value field names qty must be equal to the ids qty");
            if (!databaseSpCtxSelectStoredProcNames || databaseSpCtxSelectStoredProcNames.length !== databaseSpCtxIds.length)
                throw new Error("The database ctx value field names qty must be equal to the ids qty");
            if (!databaseSpCtxUpdateStoredProcNames || databaseSpCtxUpdateStoredProcNames.length !== databaseSpCtxIds.length)
                throw new Error("The database ctx value field names qty must be equal to the ids qty");
            if (!databaseSpCtxSelectAllStoredProcNames || databaseSpCtxSelectAllStoredProcNames.length !== databaseSpCtxIds.length)
                throw new Error("The database ctx value field names qty must be equal to the ids qty");
            if (databaseSpCtxTimeouts && databaseSpCtxTimeouts.length !== databaseSpCtxIds.length)
                throw new Error("The database ctx value field names qty must be equal to the ids qty");
            if (databaseSpCtxValueFieldNames && databaseSpCtxValueFieldNames.length !== databaseSpCtxIds.length)
                throw new Error("The database ctx value field names qty must be equal to the ids qty");
            databaseSpCtxIds.forEach((id, index) => {
                contexts_1.DatabaseSpCtxsCollection.createInstance(id, {
                    connectionId: databaseSpCtxConnectionIds[index],
                    mode: databaseSpCtxMode[index],
                    valueFieldName: databaseSpCtxValueFieldNames ? databaseSpCtxValueFieldNames[index] : undefined,
                    timeout: databaseSpCtxTimeouts ? databaseSpCtxTimeouts[index] : 60000,
                    insertStoreProcName: databaseSpCtxInsertStoredProcNames[index],
                    deleteStoreProcName: databaseSpCtxDeleteStoredProcNames[index],
                    selectStoreProcName: databaseSpCtxSelectStoredProcNames[index],
                    updateStoreProcName: databaseSpCtxUpdateStoredProcNames[index],
                    selectAllStoreProcName: databaseSpCtxSelectAllStoredProcNames[index],
                    idFieldName: databaseSpCtxIdFieldNames[index],
                });
            });
        }
        let defaultInMemoryCtx = false;
        const { inMemoryCtxIds } = AppPropsInstance_1.AppPropsInstance.getInstance().inMemoryCtx;
        if (inMemoryCtxIds) {
            inMemoryCtxIds.forEach((id, index) => {
                if (!id)
                    throw new Error(`The inmemory ctx id [${index}] cannot be empty`);
                contexts_1.InMemoryCtxsCollection.createInstance(id);
                if (id === "Default" && !defaultInMemoryCtx)
                    defaultInMemoryCtx = true;
            });
        }
        if (!defaultInMemoryCtx)
            contexts_1.InMemoryCtxsCollection.createInstance("Default");
    }
}
exports.GlobalContexts = GlobalContexts;
