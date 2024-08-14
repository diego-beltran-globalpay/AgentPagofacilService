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
exports.ClassLoader = exports.BaseClass = void 0;
const RawLoader_1 = require("./RawLoader");
const LoggersColletion_1 = require("../../modules/logger/LoggersColletion");
class BaseClass {
}
exports.BaseClass = BaseClass;
class ClassLoader {
    constructor(folder, prefixes) {
        this.prefixes = prefixes;
        this.logger = LoggersColletion_1.LoggerInstance.getInstance();
        this.data = {};
        this.loader = new RawLoader_1.RawLoader(folder);
    }
    load(logPrefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataLoaded = yield this.loader.load(logPrefix);
            const prefixesKeys = Object.keys(this.prefixes);
            this.data = Object.keys(dataLoaded).reduce((classes, name) => {
                const prefix = prefixesKeys.filter(prefix => name.substr(0, prefix.length) === prefix);
                if (!prefix.length) {
                    if (this.prefixes["*"])
                        classes[name] = dataLoaded[name];
                }
                else if (this.prefixes[prefix[0]])
                    classes[name] = dataLoaded[name];
                return classes;
            }, {});
            return this.data;
        });
    }
}
exports.ClassLoader = ClassLoader;
