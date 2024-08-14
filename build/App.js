"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const KnexDbCollection_1 = require("./models/db/KnexDbCollection");
const MongoDbCollection_1 = require("./models/db/MongoDbCollection");
const SerialCallerEndpoint_1 = require("./models/endpoints/serial/SerialCallerEndpoint");
const codecs_1 = require("./models/protocol/codecs");
const SendByHttp_1 = require("./models/transformation/functions/senders/SendByHttp");
const ExecWASI_1 = require("./models/transformation/functions/wasi/ExecWASI");
const AppPropsInstance_1 = require("./modules/properties/AppPropsInstance");
const LoggersColletion_1 = require("./modules/logger/LoggersColletion");
const LifeCycleController_1 = require("./modules/lifecycleMethods/LifeCycleController");
const appProperties = AppPropsInstance_1.AppPropsInstance.getInstance();
const logger = LoggersColletion_1.LoggerInstance.getInstance(appProperties.logger);
// Lifecycle Controller
let lifecycleController;
const { enableLifecycleController } = appProperties.lifecycleController;
if (enableLifecycleController) {
    lifecycleController = LifeCycleController_1.LifeCycleController.getConfiguredInstance();
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield lifecycleController.loadPhaseFunctions();
        lifecycleController.start(appProperties.custom);
    }))();
}
const { loadDbModule, loadSerialPortModule, loadWasiModule, loadAxiosModule, loadIso8583Module } = appProperties.kernel;
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (loadDbModule)
        yield KnexDbCollection_1.KnexDbCollection.init();
    if (loadDbModule)
        yield MongoDbCollection_1.MongoDbCollection.init();
    if (loadSerialPortModule)
        yield SerialCallerEndpoint_1.SerialCallerEndpoint.init();
    if (loadWasiModule)
        yield ExecWASI_1.ExecWASI.init();
    if (loadAxiosModule)
        yield SendByHttp_1.SendByHttp.init();
    if (loadIso8583Module)
        yield codecs_1.ISO8583.init();
    yield Promise.resolve().then(() => __importStar(require("./Kernel")));
}))().catch(error => {
    if (lifecycleController)
        lifecycleController.error(appProperties.custom);
    logBeforeExit("Exception catched.", error);
});
// Process handlers
process.on("uncaughtException", function (err) {
    if (lifecycleController)
        lifecycleController.error(appProperties.custom);
    logBeforeExit("uncaughtException", err);
});
process.on("unhandledRejection", function (err) {
    if (lifecycleController)
        lifecycleController.error(appProperties.custom);
    logBeforeExit("unhandledRejection", err);
});
process.on("SIGTERM", function () {
    if (lifecycleController)
        lifecycleController.end(appProperties.custom);
    logBeforeExit("SIGTERM Received, Process Terminate");
});
process.on("SIGBREAK", function () {
    if (lifecycleController)
        lifecycleController.end(appProperties.custom);
    logBeforeExit("SIGBREAK Received, Process Terminate");
});
process.on("SIGINT", function () {
    if (lifecycleController)
        lifecycleController.end(appProperties.custom);
    logBeforeExit("SIGINT Received, Process Terminate");
});
process.on("SIGHUP", function () {
    const thisLogger = logger || console;
    thisLogger.warn("SIGHUP Received, Ignore");
});
process.on("SIGSEGV", function () {
    if (lifecycleController)
        lifecycleController.end(appProperties.custom);
    logBeforeExit("SIGSEGV Received, Process Terminate");
});
const logBeforeExit = (logLine, err) => {
    // handle the error safely
    const thisLogger = logger || console;
    thisLogger.error(logLine);
    if (err && err.stack)
        thisLogger.error(err.stack);
    logger
        ? logger.shutdown(function () {
            process.exit(err ? 1 : 0);
        })
        : process.exit(err ? 1 : 0);
};
