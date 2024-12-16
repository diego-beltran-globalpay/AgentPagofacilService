const crypto = require('crypto');
const log4js = require("log4js");

class BaseClass {
    // Array de string parseados desde la llamada de la funcion dentro de las reglas de transformacion
    aLogger = new AgentLogger();

    constructor(props) {
        this.props = props.reduce((newProps, prop, index) => {
            newProps[`param${index + 1}`] = prop;
            return newProps;
        }, {});
    }
}

class GenerateServiceToken extends BaseClass {
    async apply(contexts) {
        const bytesToken= crypto.randomBytes(32);
        return bytesToken.toString('hex');
    }
}

class SetLog extends BaseClass {

    async apply(contexts) {
        const { param1: dataField, param2: secondField, param3: thirdField } = this.props
        const {
            registry: { logPrefix },
        } = contexts

        let thirdData = await this.accessor.get(thirdField, contexts);
        let level = thirdData || await this.accessor.get(secondField, contexts);

        let data = await this.accessor.get(dataField, contexts) || dataField;
        let data2 = thirdData? await this.accessor.get(secondField, contexts): undefined;

        let processID = await this.accessor.get('%TResponse.data.Entity_key', contexts) || await this.accessor.get('%Ttmp.ConsultaBDNRes.afiliacion', contexts); //Seteo de EntitiKey para Log
        const processTag = processID?`[${processID}] `:``;

        data = typeof data === 'object'? JSON.stringify(data):data;
        data2 = typeof data2 === 'object'? JSON.stringify(data2):data2;

        const msg = `${processTag}${data}${data2?','+data2:''}`;

        switch (level) {
            case "info":
                this.logger.info(`[${filterId(logPrefix)}] - `,`${msg}`)
                this.aLogger.info(`[${filterId(logPrefix)}] - `,`${msg}`);
                break
            case "undefined":
            case "trace":
                this.logger.trace(`[${filterId(logPrefix)}] - `,`${msg}`)
                this.aLogger.trace(`[${filterId(logPrefix)}] - `,`${msg}`);
                break

            case "warn":
                this.logger.warn(`[${filterId(logPrefix)}] - `,`${msg}`)
                this.aLogger.warn(`[${filterId(logPrefix)}] - `,`${msg}`);
                break

            case "error":
                this.logger.error(`[${filterId(logPrefix)}] - `,`${msg}`)
                this.aLogger.error(`[${filterId(logPrefix)}] - `,`${msg}`);
                break
        }
    }
}

class SetLogAK extends BaseClass {

    async apply(contexts) {
        const { param1: dataField, param2: levelField } = this.props
        const {
            registry: { logPrefix },
        } = contexts

        let level = await this.accessor.get(levelField, contexts);
        let data = await this.accessor.get(dataField, contexts);
        data = typeof data === 'object'? JSON.stringify(data):data;

        switch (level) {
            case "info":
                this.logger.info(`[${filterId(logPrefix)}] - `, `${data}`)
                break
            case "undefined":
            case "trace":
                this.logger.trace(`[${filterId(logPrefix)}] - `, `${msg}`)
                break
            case "warn":
                this.logger.warn(`[${filterId(logPrefix)}] - `, `${msg}`)
                break
            case "error":
                this.logger.error(`[${filterId(logPrefix)}] - `, `${msg}`)
                break
        }
    }
}

class GetMysqlDate extends BaseClass {
    async apply(contexts) {

        const { param1: dataField } = this.props;
        const { registry: { logPrefix } } = contexts;

        let includeTime = await this.accessor.get(dataField, contexts);
        const now = new Date();

        return includeTime? now.toISOString().slice(0, 19).replace('T', ' ') : now.toISOString().slice(0, 10);
    }
}

class AgentLogger {
    constructor() {
        this.logger = log4js.getLogger('default');
        this.agentLogger = log4js.getLogger('Agent');
    }

    info(message, ...args) {
        this._log('info', message, ...args);
    }

    trace(message, ...args) {
        this._log('trace', message, ...args);
    }

    error(message, ...args) {
        this._log('error', message, ...args);
    }

    warn(message, ...args) {
        this._log('warn', message, ...args);
    }

    debug(message, ...args) {
        this._log('debug', message, ...args);
    }

    async _log(level, message, ...args) {
        this.logger[level](`${message}`, ...args);
        this.agentLogger[level](`${message}`, ...args);
    }
}

class isValidUpdate extends BaseClass {
    async apply(contexts) {

        const { param1: userExtraParam } = this.props;
        const { param2: consultaBDNParam } = this.props;
        const { registry: { logPrefix } } = contexts;

        let userExtra = await this.accessor.get(userExtraParam, contexts);
        let consultaBDN = await this.accessor.get(consultaBDNParam, contexts);

        const fechaLastUpdate = new Date(userExtra.updated_at);
        const fechaNewUpdate = new Date(consultaBDN.fchUltModif || consultaBDN.fechaModifica);

        if (fechaLastUpdate >= fechaNewUpdate) {
            this.aLogger.info("La fecha de los nuevos datos es previa a la actual en base de datos",
              `- user_extra date: ${fechaLastUpdate.toJSON()} - consultaBdn date: ${fechaNewUpdate.toJSON()}`);
            return 0;
        } else {
            this.aLogger.info("La fecha de los nuevos datos es correcta.",
              `- user_extra date: ${fechaLastUpdate.toJSON()} - consultaBdn date: ${fechaNewUpdate.toJSON()}`);
            return 1
        }
    }
}

class GetFinalValue extends BaseClass {
    async apply(contexts) {

        const { param1: value1req } = this.props;
        const { param2: value2req } = this.props;
        const { registry: { logPrefix } } = contexts;

        let value1 = await this.accessor.get(value1req, contexts);
        let value2 = await this.accessor.get(value2req, contexts);

        return value1 || value2;

    }
}

function filterId(logPrefix){
    return logPrefix.replace('MsgsHandler','').replace('[','').replace(']','').trim();
}

exports.SetLog = SetLog;
exports.SetLogAK = SetLogAK;
exports.GetMysqlDate = GetMysqlDate;
exports.AgentLogger = AgentLogger;
exports.isValidUpdate = isValidUpdate;
exports.GenerateServiceToken = GenerateServiceToken;
exports.GetFinalValue = GetFinalValue;
