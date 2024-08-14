"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseCtxProps = void 0;
const DatabaseCtxConfigsITF_1 = require("../../../models/contexts/database/DatabaseCtxConfigsITF");
exports.DatabaseCtxProps = [
    {
        propName: "databaseCtxIds",
        type: "string[]",
        defaultValue: undefined,
        description: "IDs of database context to be created",
    },
    {
        propName: "databaseCtxConnectionIds",
        type: "string[]",
        defaultValue: undefined,
        description: "IDs of database context to be created",
    },
    {
        propName: "databaseCtxTables",
        type: "string[]",
        defaultValue: undefined,
        description: "Table name of database context to be created",
    },
    {
        propName: "databaseCtxTimeouts",
        type: "integer[]",
        defaultValue: undefined,
        description: "Query timeout of database context to be created",
    },
    {
        propName: "databaseCtxMode",
        type: "string[]",
        defaultValue: undefined,
        description: "Operation mode of database context to be created",
    },
    {
        propName: "databaseCtxIdFieldNames",
        type: "string[]",
        defaultValue: undefined,
        description: "Name of id field in the table used to hold the database context to be created",
    },
    {
        propName: "databaseCtxValueFieldNames",
        type: "string[]",
        defaultValue: undefined,
        description: `Name of value field in the table used to hold the database context to be created. It is required only in [${DatabaseCtxConfigsITF_1.DbOpModes.KEY_VALUE}] mode`,
    },
];
