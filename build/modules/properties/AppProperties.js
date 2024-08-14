"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppProperties = void 0;
const AppProps_1 = require("../../models/appProps/AppProps");
const basicsITF_validator_1 = __importDefault(require("./params/basicsITF.validator"));
const clientITF_validator_1 = __importDefault(require("./params/clientITF.validator"));
const elementMappingITF_validator_1 = __importDefault(require("./params/elementMappingITF.validator"));
const kernelITF_validator_1 = __importDefault(require("./params/kernelITF.validator"));
const loggerITF_validator_1 = __importDefault(require("./params/loggerITF.validator"));
const targetITF_validator_1 = __importDefault(require("./params/targetITF.validator"));
const transformationITF_validator_1 = __importDefault(require("./params/transformationITF.validator"));
const controlMsgsITF_validator_1 = __importDefault(require("./params/controlMsgsITF.validator"));
const appKeyStoreITF_validator_1 = __importDefault(require("./params/appKeyStoreITF.validator"));
const authenticatorITF_validator_1 = __importDefault(require("./params/authenticatorITF.validator"));
const tasksSchedulerITF_validator_1 = __importDefault(require("./params/tasksSchedulerITF.validator"));
const memcachedCtxITF_validator_1 = __importDefault(require("./params/memcachedCtxITF.validator"));
const inMemoryCtxITF_validator_1 = __importDefault(require("./params/inMemoryCtxITF.validator"));
const lifecycleControllerITF_validator_1 = __importDefault(require("./params/lifecycleControllerITF.validator"));
const databaseCtxITF_validator_1 = __importDefault(require("./params/databaseCtxITF.validator"));
const databaseSpCtxITF_validator_1 = __importDefault(require("./params/databaseSpCtxITF.validator"));
const databaseConnectionsITF_validator_1 = __importDefault(require("./params/databaseConnectionsITF.validator"));
const tablesITF_validator_1 = __importDefault(require("./params/tablesITF.validator"));
const levelConversionITF_validator_1 = __importDefault(require("./params/levelConversionITF.validator"));
const params_1 = require("./params");
var PropsName;
(function (PropsName) {
    PropsName["BASICS_PROPS"] = "BasicsProps";
    PropsName["CLIENT_PROPS"] = "ClientProps";
    PropsName["ELEMENT_MAPPING_PROPS"] = "ElementMappingProps";
    PropsName["KERNEL_PROPS"] = "KernelProps";
    PropsName["LOGGER_PROPS"] = "LoggerProps";
    PropsName["TARGET_PROPS"] = "TargetProps";
    PropsName["TRASNFORMATION_PROPS"] = "TransformationProps";
    PropsName["CONTROL_MSGS_PROPS"] = "ControlMsgsProps";
    PropsName["APP_KEYSTORE_PROPS"] = "AppKeyStoreProps";
    PropsName["AUTHENTICATOR_PROPS"] = "AuthenticatorProps";
    PropsName["TASKS_SCHEDULER_PROPS"] = "TasksSchedulerProps";
    PropsName["MEMCACHED_CTX_PROPS"] = "MemcachedCtxProps";
    PropsName["IN_MEMORY_CTX_PROPS"] = "InMemoryCtxProps";
    PropsName["LIFECYCLE_CONTROLLER_PROPS"] = "LifecycleControllerProps";
    PropsName["DATABASE_CTX_PROPS"] = "DatabaseCtxProps";
    PropsName["DATABASE_SP_CTX_PROPS"] = "DatabaseSpCtxProps";
    PropsName["DATABASE_CONN_PROPS"] = "DatabaseConnectionsProps";
    PropsName["TABLES_PROPS"] = "TablesProps";
    PropsName["LEVEL_CONVERSION_PROPS"] = "LevelConversionProps";
})(PropsName || (PropsName = {}));
class AppProperties extends AppProps_1.AppProps {
    constructor() {
        super({
            [PropsName.BASICS_PROPS]: {
                props: params_1.BasicsProps,
                validate: basicsITF_validator_1.default,
            },
            [PropsName.CLIENT_PROPS]: {
                props: params_1.ClientProps,
                validate: clientITF_validator_1.default,
            },
            ElementMappingProps: {
                props: params_1.ElementMappingProps,
                validate: elementMappingITF_validator_1.default,
            },
            [PropsName.KERNEL_PROPS]: {
                props: params_1.KernelProps,
                validate: kernelITF_validator_1.default,
            },
            [PropsName.LOGGER_PROPS]: {
                props: params_1.LoggerProps,
                validate: loggerITF_validator_1.default,
            },
            [PropsName.TARGET_PROPS]: {
                props: params_1.TargetProps,
                validate: targetITF_validator_1.default,
            },
            [PropsName.TRASNFORMATION_PROPS]: {
                props: params_1.TransformationProps,
                validate: transformationITF_validator_1.default,
            },
            [PropsName.CONTROL_MSGS_PROPS]: {
                props: params_1.ControlMsgsProps,
                validate: controlMsgsITF_validator_1.default,
            },
            [PropsName.APP_KEYSTORE_PROPS]: {
                props: params_1.AppKeyStoreProps,
                validate: appKeyStoreITF_validator_1.default,
            },
            [PropsName.AUTHENTICATOR_PROPS]: {
                props: params_1.AuthenticatorProps,
                validate: authenticatorITF_validator_1.default,
            },
            [PropsName.TASKS_SCHEDULER_PROPS]: {
                props: params_1.TasksSchedulerProps,
                validate: tasksSchedulerITF_validator_1.default,
            },
            [PropsName.MEMCACHED_CTX_PROPS]: {
                props: params_1.MemcachedCtxProps,
                validate: memcachedCtxITF_validator_1.default,
            },
            [PropsName.IN_MEMORY_CTX_PROPS]: {
                props: params_1.InMemoryCtxProps,
                validate: inMemoryCtxITF_validator_1.default,
            },
            [PropsName.LIFECYCLE_CONTROLLER_PROPS]: {
                props: params_1.LifecycleControllerProps,
                validate: lifecycleControllerITF_validator_1.default,
            },
            [PropsName.DATABASE_CTX_PROPS]: {
                props: params_1.DatabaseCtxProps,
                validate: databaseCtxITF_validator_1.default,
            },
            [PropsName.DATABASE_SP_CTX_PROPS]: {
                props: params_1.DatabaseSpCtxProps,
                validate: databaseSpCtxITF_validator_1.default,
            },
            [PropsName.DATABASE_CONN_PROPS]: {
                props: params_1.DatabaseConnectionsProps,
                validate: databaseConnectionsITF_validator_1.default,
            },
            [PropsName.TABLES_PROPS]: {
                props: params_1.TablesProps,
                validate: tablesITF_validator_1.default,
            },
            [PropsName.LEVEL_CONVERSION_PROPS]: {
                props: params_1.LevelConversionProps,
                validate: levelConversionITF_validator_1.default,
            },
        });
    }
    get custom() {
        return this.parseProperties(AppProps_1.CUSTOM_PROPS);
    }
    get basics() {
        return this.parseProperties(PropsName.BASICS_PROPS);
    }
    get client() {
        return this.parseProperties(PropsName.CLIENT_PROPS);
    }
    get elementMapping() {
        return this.parseProperties(PropsName.ELEMENT_MAPPING_PROPS);
    }
    get kernel() {
        return this.parseProperties(PropsName.KERNEL_PROPS);
    }
    get logger() {
        return this.parseProperties(PropsName.LOGGER_PROPS);
    }
    get target() {
        return this.parseProperties(PropsName.TARGET_PROPS);
    }
    get transformation() {
        return this.parseProperties(PropsName.TRASNFORMATION_PROPS);
    }
    get controlMsgs() {
        return this.parseProperties(PropsName.CONTROL_MSGS_PROPS);
    }
    get appKeyStore() {
        return this.parseProperties(PropsName.APP_KEYSTORE_PROPS);
    }
    get authenticator() {
        return this.parseProperties(PropsName.AUTHENTICATOR_PROPS);
    }
    get tasksScheduler() {
        return this.parseProperties(PropsName.TASKS_SCHEDULER_PROPS);
    }
    get memcachedCtx() {
        return this.parseProperties(PropsName.MEMCACHED_CTX_PROPS);
    }
    get inMemoryCtx() {
        return this.parseProperties(PropsName.IN_MEMORY_CTX_PROPS);
    }
    get lifecycleController() {
        return this.parseProperties(PropsName.LIFECYCLE_CONTROLLER_PROPS);
    }
    get databaseCtx() {
        return this.parseProperties(PropsName.DATABASE_CTX_PROPS);
    }
    get databaseSpCtx() {
        return this.parseProperties(PropsName.DATABASE_SP_CTX_PROPS);
    }
    get databaseConnections() {
        return this.parseProperties(PropsName.DATABASE_CONN_PROPS);
    }
    get tables() {
        return this.parseProperties(PropsName.TABLES_PROPS);
    }
    get levelConversion() {
        return this.parseProperties(PropsName.LEVEL_CONVERSION_PROPS);
    }
}
exports.AppProperties = AppProperties;
