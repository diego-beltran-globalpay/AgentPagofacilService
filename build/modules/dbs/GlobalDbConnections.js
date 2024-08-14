"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalDbConnections = void 0;
const AppPropsInstance_1 = require("../properties/AppPropsInstance");
const db_1 = require("../../models/db");
class GlobalDbConnections {
    static initiateAll(logger) {
        const { databaseIds, databaseAddresses, databaseDialects, databasePasswords, databaseSchemas, databaseUsers, databaseMaxPool, databaseMinPool, databaseAcquireTimeouts, } = AppPropsInstance_1.AppPropsInstance.getInstance().databaseConnections;
        if (databaseIds) {
            if (!databaseAddresses || databaseAddresses.length !== databaseIds.length)
                throw new Error("The database ctx addresses qty must be equal to the ids qty");
            if (!databaseDialects || databaseDialects.length !== databaseIds.length)
                throw new Error("The database ctx dialects qty must be equal to the ids qty");
            if (!databaseUsers || databaseUsers.length !== databaseIds.length)
                throw new Error("The database ctx users qty must be equal to the ids qty");
            if (!databaseSchemas || databaseSchemas.length !== databaseIds.length)
                throw new Error("The database ctx schema names qty must be equal to the ids qty");
            if (databasePasswords && databasePasswords.length !== databaseIds.length)
                throw new Error("The database ctx passwords qty must be equal to the ids qty");
            if (databaseMaxPool && databaseMaxPool.length !== databaseIds.length)
                throw new Error("The database max pool qty must be equal to the ids qty");
            if (databaseMinPool && databaseMinPool.length !== databaseIds.length)
                throw new Error("TThe database min pool qty must be equal to the ids qty");
            if (databaseAcquireTimeouts && databaseAcquireTimeouts.length !== databaseIds.length)
                throw new Error("The database ctx acquire new connection timeouts qty must be equal to the ids qty");
            databaseIds.forEach((id, index) => {
                const options = {
                    address: databaseAddresses[index],
                    dialect: databaseDialects[index],
                    user: databaseUsers[index],
                    schemaName: databaseSchemas[index],
                    minPool: databaseMinPool ? databaseMinPool[index] : undefined,
                    maxPool: databaseMaxPool ? databaseMaxPool[index] : undefined,
                    acquireTimeout: databaseAcquireTimeouts ? databaseAcquireTimeouts[index] : undefined,
                    password: databasePasswords ? databasePasswords[index] : undefined,
                };
                if (databaseDialects[index] === db_1.DbDialects.MONGO)
                    db_1.MongoDbCollection.createConnection(id, options);
                else
                    db_1.KnexDbCollection.createConnection(id, options);
            });
        }
        if (logger) {
            db_1.MongoDbCollection.initStatusLogger(logger);
            db_1.KnexDbCollection.initStatusLogger(logger);
        }
    }
}
exports.GlobalDbConnections = GlobalDbConnections;
