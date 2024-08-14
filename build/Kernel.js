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
const models_1 = require("./models");
// Import modules
const AppPropsInstance_1 = require("./modules/properties/AppPropsInstance");
const LoggersColletion_1 = require("./modules/logger/LoggersColletion");
const Router_1 = require("./modules/router/Router");
const AppPropsKeyStore_1 = require("./modules/properties/keyStore/AppPropsKeyStore");
const Versioner_1 = require("./modules/version/Versioner");
const MsgsTransformation_1 = require("./modules/msgsTransformation/MsgsTransformation");
const GlobalContexts_1 = require("./modules/contexts/GlobalContexts");
const GlobalDbConnections_1 = require("./modules/dbs/GlobalDbConnections");
const Scheduler_1 = require("./modules/scheduler/Scheduler");
const LevelConversion_1 = require("./modules/levelConversion/LevelConversion");
const ElementMapping_1 = require("./modules/elementMapping/ElementMapping");
const servers_1 = require("./modules/servers");
const Statisticts_1 = require("./models/statistics/Statisticts");
const GlobalFilesCollection_1 = require("./models/transformation/tables/GlobalFilesCollection");
process.title = "ApplicationKernel";
const appProperties = AppPropsInstance_1.AppPropsInstance.getInstance();
const logger = LoggersColletion_1.LoggerInstance.getInstance(appProperties.logger);
Versioner_1.Versioner.printVersion();
const { useSecureStore } = appProperties.kernel;
if (useSecureStore)
    appProperties.setKeyStore(AppPropsKeyStore_1.AppPropsKeyStore.getInstance());
const { applyLevelTransformation, applyElementMapping } = appProperties.kernel;
// Test mode app
if (appProperties.basics.runOnTestMode) {
    logger.info(`[Kernel] - Running app on test mode. It will be closed after 20 seconds`);
    setTimeout(() => {
        process.exit(0);
    }, 20000);
}
// Db Status
GlobalDbConnections_1.GlobalDbConnections.initiateAll(LoggersColletion_1.LoggerInstance.getInstance());
// Global contexts
GlobalContexts_1.GlobalContexts.initiateCtxs();
// Global tables
const { tableEncodings, tableFilesPath, tableIds } = appProperties.tables;
if (tableIds && tableFilesPath && tableEncodings)
    GlobalFilesCollection_1.GlobalTablesCollection.init(tableIds, tableFilesPath, tableEncodings);
// Stadistics
const appStats = new Statisticts_1.Stadistics();
// Cron scheduler
const { enableScheduler } = AppPropsInstance_1.AppPropsInstance.getInstance().tasksScheduler;
if (enableScheduler)
    Scheduler_1.Scheduler.getConfiguredInstance();
// Global target and client instances
const target = new servers_1.Target();
const client = new servers_1.Client();
// Testers
const clientEndpointTester = client.getEndpointsTester();
const targetEndpointTester = target.getEndpointsTester();
// Routers
const { clientSwitchFilePath, targetSwitchFilePath } = appProperties.kernel;
const clientToTargetRouter = new Router_1.Router(clientSwitchFilePath, 60, "[Target][Router]");
const targetToClientRouter = new Router_1.Router(targetSwitchFilePath, 60, "[Client][Router]");
// ContextKey generator
const { clientContextKeyType, clientContextFieldsList, clientAltContextKeyType, clientAltContextFieldsList } = appProperties.kernel;
const clientMainContextKey = models_1.MsgKey.create(clientContextKeyType, clientContextFieldsList.split(","));
const clientAltContextKey = models_1.MsgKey.create(clientAltContextKeyType, clientAltContextFieldsList.split(","));
// ContextKey generator
const { targetContextKeyType, targetContextFieldsList, targetAltContextKeyType, targetAltContextFieldsList } = appProperties.kernel;
const targetMainContextKey = models_1.MsgKey.create(targetContextKeyType, targetContextFieldsList.split(","));
const targetAltContextKey = models_1.MsgKey.create(targetAltContextKeyType, targetAltContextFieldsList.split(","));
// Reference message table
const clientOngoingMessages = new models_1.InMemoryCtx().setLogPrefix("ClientOngoingMessages");
const targetOngoingMessages = new models_1.InMemoryCtx().setLogPrefix("TargetOngoingMessages");
// Pool
const { clientPoolMethod, targetPoolMethod } = appProperties.kernel;
const targetPool = new models_1.Pool(targetPoolMethod).setLogPrexis("[Target][Pool]");
const clientPool = new models_1.Pool(clientPoolMethod).setLogPrexis("[Client][Pool]");
// Transformation
const transformation = MsgsTransformation_1.MsgsTransformation.fromAppProperties("MsgsHandler");
transformation.initLoad();
// Level conversion module
const { clientLevelConversionAfTransf, clientLevelConversionBfTransf, targetLevelConversionAfTransf, targetLevelConversionBfTransf, } = appProperties.levelConversion;
const levelConversion = new LevelConversion_1.LevelConversion({
    ClientAfTransf: clientLevelConversionAfTransf,
    ClientBfTransf: clientLevelConversionBfTransf,
    TargetAfTransf: targetLevelConversionAfTransf,
    TargetBfTransf: targetLevelConversionBfTransf,
});
// Mapping Element module
const { clientElementMappingAfTransf: ClientAfTransf, clientElementMappingBfTransf: ClientBfTransf, targetElementMappingAfTransf: TargetAfTransf, targetElementMappingBfTransf: TargetBfTransf, loadElementMappingOnce, elementMappingFilePath, } = appProperties.elementMapping;
const mappingElement = new ElementMapping_1.ElementMapping(elementMappingFilePath.split(","), loadElementMappingOnce, {
    ClientAfTransf,
    ClientBfTransf,
    TargetAfTransf,
    TargetBfTransf,
});
const handleClientRequest = (endpoint, message) => __awaiter(void 0, void 0, void 0, function* () {
    let messageID, body;
    try {
        const rcvTime = new Date();
        ({ body, messageID } = message);
        const isControlMsg = (yield clientEndpointTester.analizeRcvMsg(endpoint, message)) ||
            (client.authenticator ? yield client.authenticator.analizeRcvMsg(endpoint, message) : null);
        if (isControlMsg)
            return;
        logger.trace(`[Kernel] - Client source Endpoint ID: [${endpoint.id}]`, { messageID });
        logger.trace(`[Kernel] - Message decoded: [${JSON.stringify(body)}]`, { messageID });
        if (applyLevelTransformation)
            message.body = levelConversion.convertLevel(message, LevelConversion_1.ConvDirections.clientBfTransf);
        if (applyElementMapping)
            message.body = mappingElement.mapElements(message, ElementMapping_1.MapDirections.clientBfTransf);
        // Generate context keys... if both of them are undefined, we have to send an error
        const mainContextKey = clientMainContextKey.get(body);
        const altContextKey = clientAltContextKey.get(body);
        // Check if the message is a client reply or not
        const originMsgContext = targetOngoingMessages.getEntry(mainContextKey) || targetOngoingMessages.getEntry(altContextKey) || targetOngoingMessages.getEntry(messageID);
        if (originMsgContext) {
            logger.debug(`[Kernel] - This message is an answer to a request. We will respond to the target with it.`, { messageID });
            const { data: { endpoint: originEndpoint, groupName }, createDateTime: sentTime, } = originMsgContext;
            originEndpoint.updateResponseAvgTime(sentTime, rcvTime);
            const tmp = yield transformation.fromClientToTarget(message, groupName);
            const { action, result } = tmp;
            message = Object.assign(Object.assign({}, message), { action, body: result });
            switch (message.action) {
                case models_1.MsgActions.autoReply:
                    if (applyElementMapping)
                        message.body = mappingElement.mapElements(message, ElementMapping_1.MapDirections.clientAfTransf);
                    if (applyLevelTransformation)
                        message.body = levelConversion.convertLevel(message, LevelConversion_1.ConvDirections.clientAfTransf);
                    logger.debug(`[Kernel] - Sending response to this client`, { messageID });
                    endpoint.autoReply(message);
                    break;
                case models_1.MsgActions.send:
                    if (applyElementMapping)
                        message.body = mappingElement.mapElements(message, ElementMapping_1.MapDirections.targetAfTransf);
                    if (applyLevelTransformation)
                        message.body = levelConversion.convertLevel(message, LevelConversion_1.ConvDirections.targetAfTransf);
                    originEndpoint.send(message);
                    break;
                case models_1.MsgActions.ignoreMessage:
                    logger.trace("[Kernel] - Ignore this received message", { messageID });
                    break;
                case models_1.MsgActions.doNothing:
                    logger.trace("[Kernel] - Do nothing with this received message", { messageID });
                    break;
                default:
                    logger.error("[Kernel] - Action is not supported", { messageID });
                    break;
            }
        }
        else {
            logger.debug(`[Kernel] - This message is not an answer to a request. We will send it to some target`, { messageID });
            // Apply switch rules
            const groupID = clientToTargetRouter.route(message);
            // Check if there is some host connected...
            const anyConnected = targetPool.isAnyoneAvailable(groupID);
            logger.trace(`[Kernel] - There is some target connected: ${anyConnected.toString().toUpperCase()}`, { messageID });
            message = Object.assign(Object.assign({}, message), { body, mainContextKey, altContextKey });
            const tmp = !anyConnected ? yield transformation.autoReply(message) : yield transformation.fromClientToTarget(message);
            const { action, result, groupName } = tmp;
            message = Object.assign(Object.assign({}, message), { action, body: result });
            switch (message.action) {
                case models_1.MsgActions.autoReply:
                    if (applyElementMapping)
                        message.body = mappingElement.mapElements(message, ElementMapping_1.MapDirections.clientAfTransf);
                    if (applyLevelTransformation)
                        message.body = levelConversion.convertLevel(message, LevelConversion_1.ConvDirections.clientAfTransf);
                    logger.debug(`[Kernel] - Sending response to this client`, { messageID });
                    endpoint.autoReply(message);
                    break;
                case models_1.MsgActions.send:
                    if (applyElementMapping)
                        message.body = mappingElement.mapElements(message, ElementMapping_1.MapDirections.targetAfTransf);
                    if (applyLevelTransformation)
                        message.body = levelConversion.convertLevel(message, LevelConversion_1.ConvDirections.clientAfTransf);
                    clientOngoingMessages.addEntry(mainContextKey, { endpoint, groupName });
                    clientOngoingMessages.addEntry(altContextKey, { endpoint, groupName });
                    clientOngoingMessages.addEntry(messageID, { endpoint, groupName });
                    const chosenEndpoint = targetPool.getEndpoint(groupID);
                    chosenEndpoint.send(message);
                    break;
                case models_1.MsgActions.ignoreMessage:
                    logger.trace("[Kernel] - Ignore this received message", { messageID });
                    break;
                case models_1.MsgActions.doNothing:
                    logger.trace("[Kernel] - Do nothing with this received message", { messageID });
                    break;
                default:
                    logger.error("[Kernel] - Action is not supported", { messageID });
                    break;
            }
        }
    }
    catch (error) {
        logger.error(`[Kernel] - Error: [${error.stack}]`, { messageID });
    }
});
const handleTargetRequest = (endpoint, message) => __awaiter(void 0, void 0, void 0, function* () {
    let messageID, body;
    try {
        const rcvTime = new Date();
        ({ messageID, body } = message);
        const isControlMsg = (yield targetEndpointTester.analizeRcvMsg(endpoint, message)) ||
            (target.authenticator ? yield target.authenticator.analizeRcvMsg(endpoint, message) : null);
        if (isControlMsg)
            return;
        logger.trace(`[Kernel] - Target source Endpoint ID: [${endpoint.id}]`, { messageID });
        logger.trace(`[Kernel] - Message decoded: [${JSON.stringify(body)}]`, { messageID });
        if (applyElementMapping)
            message.body = mappingElement.mapElements(message, ElementMapping_1.MapDirections.targetBfTransf);
        // Generate context keys... if both of them are undefined, we have to send an error
        const mainContextKey = targetMainContextKey.get(body);
        const altContextKey = targetAltContextKey.get(body);
        // Check if the message is a client reply or not
        const originContext = clientOngoingMessages.getEntry(mainContextKey) || clientOngoingMessages.getEntry(altContextKey) || clientOngoingMessages.getEntry(messageID);
        if (originContext) {
            logger.debug(`[Kernel] - This message is an answer to a request. We will respond to the client with it.`, { messageID });
            const { data: { endpoint: originEndpoint, groupName }, createDateTime: sentTime, } = originContext;
            originEndpoint.updateResponseAvgTime(sentTime, rcvTime);
            const tmp = yield transformation.fromTargetToClient(message, groupName);
            const { action, result } = tmp;
            message = Object.assign(Object.assign({}, message), { action, body: result });
            switch (message.action) {
                case models_1.MsgActions.autoReply:
                    if (applyElementMapping)
                        message.body = mappingElement.mapElements(message, ElementMapping_1.MapDirections.targetAfTransf);
                    if (applyLevelTransformation)
                        message.body = levelConversion.convertLevel(message, LevelConversion_1.ConvDirections.targetAfTransf);
                    logger.debug(`[Kernel] - Sending response to this target`, { messageID });
                    endpoint.autoReply(message);
                    break;
                case models_1.MsgActions.send:
                    if (applyElementMapping)
                        message.body = mappingElement.mapElements(message, ElementMapping_1.MapDirections.clientAfTransf);
                    if (applyLevelTransformation)
                        message.body = levelConversion.convertLevel(message, LevelConversion_1.ConvDirections.clientAfTransf);
                    originEndpoint.send(message);
                    break;
                case models_1.MsgActions.ignoreMessage:
                    logger.trace("[Kernel] - Ignore this received message", { messageID });
                    break;
                case models_1.MsgActions.doNothing:
                    logger.trace("[Kernel] - Do nothing with this received message", { messageID });
                    break;
                default:
                    logger.error("[Kernel] - Action is not supported", { messageID });
                    break;
            }
        }
        else {
            logger.debug(`[Kernel] - This message is not an answer to a request. We will send it to some client`, { messageID });
            // Apply switch rules
            const groupID = targetToClientRouter.route(message);
            // Check if there is some host connected...
            const anyConnected = clientPool.isAnyoneAvailable(groupID);
            logger.trace(`[Kernel] - There is some client connected: ${anyConnected.toString().toUpperCase()}`, { messageID });
            message = Object.assign(Object.assign({}, message), { body, mainContextKey, altContextKey });
            const tmp = !anyConnected ? yield transformation.autoReply(message) : yield transformation.fromTargetToClient(message);
            const { action, result, groupName } = tmp;
            message = Object.assign(Object.assign({}, message), { action, body: result });
            switch (message.action) {
                case models_1.MsgActions.autoReply:
                    if (applyElementMapping)
                        message.body = mappingElement.mapElements(message, ElementMapping_1.MapDirections.targetAfTransf);
                    if (applyLevelTransformation)
                        message.body = levelConversion.convertLevel(message, LevelConversion_1.ConvDirections.targetAfTransf);
                    logger.debug(`[Kernel] - Sending response to this target`, { messageID });
                    endpoint.autoReply(message);
                    break;
                case models_1.MsgActions.send:
                    if (applyElementMapping)
                        message.body = mappingElement.mapElements(message, ElementMapping_1.MapDirections.clientAfTransf);
                    if (applyLevelTransformation)
                        message.body = levelConversion.convertLevel(message, LevelConversion_1.ConvDirections.clientAfTransf);
                    targetOngoingMessages.addEntry(mainContextKey, { endpoint, groupName });
                    targetOngoingMessages.addEntry(altContextKey, { endpoint, groupName });
                    targetOngoingMessages.addEntry(messageID, { endpoint, groupName });
                    const chosenEndpoint = clientPool.getEndpoint(groupID);
                    chosenEndpoint.send(message);
                    break;
                case models_1.MsgActions.ignoreMessage:
                    logger.trace("[Kernel] - Ignore this received message", { messageID });
                    break;
                case models_1.MsgActions.doNothing:
                    logger.trace("[Kernel] - Do nothing with this received message", { messageID });
                    break;
                default:
                    logger.error("[Kernel] - Action is not supported", { messageID });
                    break;
            }
        }
    }
    catch (error) {
        logger.error(`[Kernel] - We found an error while we were trying to process this message from caller. Error: [${error.toString()}]`, {
            messageID,
        });
        logger.error(`[Kernel] - Error: [${error.stack}]`, { messageID });
    }
});
// Start APP
const clientServers = [];
const targetServers = [];
const clientCallers = [];
const targetCallers = [];
// Start passive clients
const { enableClientTcpListener } = appProperties.kernel;
if (enableClientTcpListener)
    clientServers.push(client.getListenerTcpEndpoints());
const { enableClientHttpListener } = appProperties.kernel;
if (enableClientHttpListener)
    clientServers.push(client.getListenerHttpEndpoints());
const { enableClientWsListener } = appProperties.kernel;
if (enableClientWsListener)
    clientServers.push(client.getListenerWsEndpoints());
clientServers.forEach(server => {
    server.start();
    server.on("newConnection", (endpoint, groupID) => {
        clientEndpointTester.addEndpoint(endpoint);
        clientPool.addEndpoint(endpoint, groupID);
        appStats.addEndpoint("client", endpoint);
        endpoint.on("newMessage", handleClientRequest);
    });
});
// Start passive targets
const { enableTargetTcpListener } = appProperties.kernel;
if (enableTargetTcpListener)
    targetServers.push(target.getListenerTcpEndpoints());
const { enableTargetHttpListener } = appProperties.kernel;
if (enableTargetHttpListener)
    targetServers.push(target.getListenerHttpEndpoints());
const { enableTargetWsListener } = appProperties.kernel;
if (enableTargetWsListener)
    targetServers.push(target.getListenerWsEndpoints());
targetServers.forEach(server => {
    server.start();
    server.on("newConnection", (endpoint, groupID) => {
        targetEndpointTester.addEndpoint(endpoint);
        targetPool.addEndpoint(endpoint, groupID);
        appStats.addEndpoint("target", endpoint);
        endpoint.on("newMessage", handleTargetRequest);
    });
});
// Start active targets
const { enableTargetTcpCaller } = appProperties.kernel;
if (enableTargetTcpCaller)
    targetCallers.push(target.getCallerTcpEndpoints());
const { enableTargetSerialCaller } = appProperties.kernel;
if (enableTargetSerialCaller)
    targetCallers.push(target.getCallerSerialEndpoints());
const { enableTargetHttpCaller } = appProperties.kernel;
if (enableTargetHttpCaller)
    targetCallers.push(target.getCallerHttpEndpoints());
targetCallers.forEach(({ ids, names = [], endpoints }) => {
    endpoints.forEach((endpoint, index) => {
        models_1.GlobalEndpointCollection.get().addEndpoint(names[index] || index.toString(), endpoint);
        targetEndpointTester.addEndpoint(endpoint);
        targetPool.addEndpoint(endpoint, ids[index]);
        appStats.addEndpoint("target", endpoint);
        endpoint.on("newMessage", handleTargetRequest);
    });
});
// Start active clients
const { enableClientTcpCaller } = appProperties.kernel;
if (enableClientTcpCaller)
    clientCallers.push(client.getCallerTcpEndpoints());
const { enableClientSerialCaller } = appProperties.kernel;
if (enableClientSerialCaller)
    clientCallers.push(client.getCallerSerialEndpoints());
const { enableClientHttpCaller } = appProperties.kernel;
if (enableClientHttpCaller)
    clientCallers.push(client.getCallerHttpEndpoints());
clientCallers.forEach(({ ids, names = [], endpoints }) => {
    endpoints.forEach((endpoint, index) => {
        models_1.GlobalEndpointCollection.get().addEndpoint(names[index] || index.toString(), endpoint);
        clientEndpointTester.addEndpoint(endpoint);
        clientPool.addEndpoint(endpoint, ids[index]);
        appStats.addEndpoint("client", endpoint);
        endpoint.on("newMessage", handleClientRequest);
    });
});
