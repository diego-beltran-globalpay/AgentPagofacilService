"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = void 0;
const GetITF_1 = require("./GetITF");
const GetITF_validator_1 = __importDefault(require("./GetITF.validator"));
const FunctionModel_1 = require("../FunctionModel");
const NamedFields_1 = require("../../../utils/NamedFields");
const GlobalFilesCollection_1 = require("../../tables/GlobalFilesCollection");
class Get extends FunctionModel_1.FunctionModel {
    constructor() {
        super(...arguments);
        this.getReverseTables = (tables) => {
            const reversedTables = {};
            for (const tableName in tables) {
                reversedTables[tableName] = {};
                const table = tables[tableName];
                for (const elementName in table) {
                    const value = table[elementName].toString();
                    reversedTables[tableName][value] = elementName;
                }
            }
            return reversedTables;
        };
    }
    apply(contexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registry: { logPrefix }, } = contexts;
            const { keyRegFieldName, fieldNameSource, isReverseTable, fileId = "" } = this.props;
            const keyRegValue = yield this.accessor.get(fieldNameSource, contexts);
            this.logger.trace(`[ Tables ] - The tables name is ${keyRegFieldName}`, { logPrefix });
            this.logger.trace(`[ Tables ] - The tables reg key found in ${fieldNameSource} is ${keyRegValue}`, { logPrefix });
            this.logger.trace(`[ Tables ] - The table will be used in reverse mode: ${isReverseTable}`, { logPrefix });
            const tableFile = GlobalFilesCollection_1.GlobalTablesCollection.get().getFile(fileId);
            if (!tableFile)
                throw new Error(`The table file [${fileId}} was not found.`);
            if (!tableFile.Tables)
                throw new Error("The element Tables was not found inside the file.");
            if (isReverseTable && !tableFile.ReverseTable)
                tableFile.ReverseTable = this.getReverseTables(tableFile.Tables);
            const table = isReverseTable ? tableFile.ReverseTable[keyRegFieldName] : tableFile.Tables[keyRegFieldName];
            if (table) {
                let tableField = table[keyRegValue];
                if (tableField) {
                    this.logger.trace(`[ Tables ] - The value found is ${tableField}`, { logPrefix });
                    return tableField;
                }
                else {
                    tableField = table["_default_"];
                    this.logger.trace(`[ Tables ] - Reg value not found. We get the default value: ${tableField}`, { logPrefix });
                    return tableField;
                }
            }
            else {
                this.logger.warn(`[ Tables ] - The table ${keyRegFieldName} was not found.`, { logPrefix });
            }
        });
    }
}
exports.Get = Get;
Get.buildFromString = (paramsToParse) => {
    const params = NamedFields_1.NamedFields.getParams(paramsToParse, GetITF_1.fieldsNameMappigns, GetITF_validator_1.default);
    const { fileId } = params;
    if (!GlobalFilesCollection_1.GlobalTablesCollection.isInited())
        throw new Error(`The tables module is not inited.`);
    if (!GlobalFilesCollection_1.GlobalTablesCollection.get().getFile(fileId))
        throw new Error(`The table file [${fileId}} was not found.`);
    return new Get(params);
};
