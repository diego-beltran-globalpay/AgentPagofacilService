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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionableClass = void 0;
const LoggersColletion_1 = require("../../../modules/logger/LoggersColletion");
const TransfCtxAccessor_1 = require("../contexts/TransfCtxAccessor");
const FunctionModel_1 = require("../functions/FunctionModel");
const db_1 = require("../../db");
class ExtensionableClass extends FunctionModel_1.FunctionModel {
    static addBasicMethods(customFunctions) {
        for (const name in customFunctions) {
            if (customFunctions[name].prototype) {
                customFunctions[name].prototype.dbConnections = db_1.DbCollection.getRawConnections();
                customFunctions[name].prototype.logger = LoggersColletion_1.LoggerInstance.getInstance();
                customFunctions[name].prototype.accessor = TransfCtxAccessor_1.TransfCtxAccessorInst.getInstance();
                customFunctions[name].prototype.applySave = ExtensionableClass.prototype.applySave;
                customFunctions[name].prototype.applyReturn = ExtensionableClass.prototype.applyReturn;
            }
        }
    }
    constructor(props) {
        super(props);
    }
    apply(context) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
exports.ExtensionableClass = ExtensionableClass;
