"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSpCtxProps = void 0;
const DatabaseCtxConfigsITF_1 = require("../../../models/contexts/database/DatabaseCtxConfigsITF");
exports.DatabaseSpCtxProps = [
    {
        propName: "databaseSpCtxIds",
        type: "string[]",
        defaultValue: undefined,
        description: "IDs of database context to be created",
    },
    {
        propName: "databaseSpCtxConnectionIds",
        type: "string[]",
        defaultValue: undefined,
        description: "IDs of database context to be created",
    },
    {
        propName: "databaseSpCtxMode",
        type: "string[]",
        defaultValue: undefined,
        description: "Operation mode of database context to be created",
    },
    {
        propName: "databaseSpCtxTimeouts",
        type: "integer[]",
        defaultValue: undefined,
        description: "Query timeout of database context to be created",
    },
    {
        propName: "databaseSpCtxValueFieldNames",
        type: "string[]",
        defaultValue: undefined,
        description: `Name of value field in the table used to hold the database context to be created. It is required only in [${DatabaseCtxConfigsITF_1.DbOpModes.KEY_VALUE}] mode`,
    },
    {
        propName: "databaseSpCtxInsertStoredProcNames",
        type: "string[]",
        defaultValue: undefined,
        description: `Name of stored procedure use to upsert a row in the database context to be created.`,
    },
    {
        propName: "databaseSpCtxDeleteStoredProcNames",
        type: "string[]",
        defaultValue: undefined,
        description: `Name of stored procedure use to delete a row in the database context to be created.`,
    },
    {
        propName: "databaseSpCtxSelectStoredProcNames",
        type: "string[]",
        defaultValue: undefined,
        description: `Name of stored procedure use to get a row in the database context to be created.`,
    },
    {
        propName: "databaseSpCtxUpdateStoredProcNames",
        type: "string[]",
        defaultValue: undefined,
        description: `Name of stored procedure use to update a row in the database context to be created.`,
    },
    {
        propName: "databaseSpCtxSelectAllStoredProcNames",
        type: "string[]",
        defaultValue: undefined,
        description: `Name of stored procedure use to select all rows in the database context to be created.`,
    },
    {
        propName: "databaseSpCtxIdFieldNames",
        type: "string[]",
        defaultValue: undefined,
        description: "Name of id field in the table used to hold the database context to be created",
    },
];
