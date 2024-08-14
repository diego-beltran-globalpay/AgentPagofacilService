"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionsProps = void 0;
const DbConfigITF_1 = require("../../../models/db/DbConfigITF");
exports.DatabaseConnectionsProps = [
    {
        propName: "databaseIds",
        type: "string[]",
        defaultValue: undefined,
        description: "IDs of database context to be created",
    },
    {
        propName: "databaseAddresses",
        type: "string[]",
        defaultValue: undefined,
        description: "Address of database context to be created",
    },
    {
        propName: "databaseDialects",
        type: "string[]",
        defaultValue: undefined,
        description: `Dialect of database context to be created. Options: [${Object.values(DbConfigITF_1.DbDialects)}]`,
    },
    {
        propName: "databaseSchemas",
        type: "string[]",
        defaultValue: undefined,
        description: "Schema name of database context to be created",
    },
    {
        propName: "databaseUsers",
        type: "string[]",
        defaultValue: undefined,
        description: "Username to create connection with database context",
    },
    {
        propName: "databasePasswords",
        type: "string[]",
        defaultValue: undefined,
        description: "Password to create connection with database context",
    },
    {
        propName: "databaseMinPool",
        type: "integer[]",
        defaultValue: undefined,
        description: "Minimun connections available in the pool of database context to be created",
    },
    {
        propName: "databaseMaxPool",
        type: "integer[]",
        defaultValue: undefined,
        description: "Maximum connections available in the pool of database context to be created",
    },
    {
        propName: "databaseAcquireTimeouts",
        type: "integer[]",
        defaultValue: undefined,
        description: "Acquire new connection timeout of database context to be created",
    },
];
