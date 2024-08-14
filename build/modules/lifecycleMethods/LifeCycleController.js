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
exports.LifeCycleController = void 0;
const RawLoader_1 = require("../../models/extension/RawLoader");
const AppPropsInstance_1 = require("../properties/AppPropsInstance");
var LifeCycleStages;
(function (LifeCycleStages) {
    LifeCycleStages["START"] = "Start";
    LifeCycleStages["END"] = "End";
    LifeCycleStages["ERROR"] = "Error";
})(LifeCycleStages || (LifeCycleStages = {}));
class LifeCycleController {
    constructor(folder, functionStages) {
        this.functionStages = functionStages;
        this.loadPhaseFunctions = (logPrefix) => __awaiter(this, void 0, void 0, function* () {
            const loadedData = yield this.loader.load(logPrefix);
            Object.values(this.functionStages).forEach(stage => {
                Object.keys(loadedData).forEach(name => {
                    const add = stage.prefixes.some(prefix => name.substr(0, prefix.length) === prefix);
                    if (add)
                        stage.functions.push(loadedData[name]);
                });
            });
        });
        this.start = (props) => __awaiter(this, void 0, void 0, function* () { return this.execPhase(LifeCycleStages.START, props); });
        this.end = (props) => __awaiter(this, void 0, void 0, function* () { return this.execPhase(LifeCycleStages.END, props); });
        this.error = (props) => __awaiter(this, void 0, void 0, function* () { return this.execPhase(LifeCycleStages.ERROR, props); });
        this.execPhase = (phase, props) => __awaiter(this, void 0, void 0, function* () {
            for (const funcItem of this.functionStages[phase].functions)
                yield funcItem(props);
        });
        this.loader = new RawLoader_1.RawLoader(folder);
    }
}
exports.LifeCycleController = LifeCycleController;
LifeCycleController.getConfiguredInstance = () => {
    const functionStages = {
        Start: { prefixes: [], functions: [] },
        End: { prefixes: [], functions: [] },
        Error: { prefixes: [], functions: [] },
    };
    const { lifecycleFunctionsPrefixes, lifecycleFunctionsFolderPath } = AppPropsInstance_1.AppPropsInstance.getInstance().lifecycleController;
    lifecycleFunctionsPrefixes.split(",").forEach(keyValue => {
        const [key, value] = keyValue.split(":");
        if (!Object.values(LifeCycleStages).includes(key))
            throw new Error(`${key} is not a valid stage on lifecycle steps`);
        functionStages[key].prefixes.push(value);
    });
    return new LifeCycleController(lifecycleFunctionsFolderPath, functionStages);
};
