const AWS = require('aws-sdk');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { Readable } = require('stream');

const {
    CognitoIdentityProviderClient,
    SignUpCommand,
    AdminUpdateUserAttributesCommand,
    AdminConfirmSignUpCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const {AgentLogger} = require("./ExtensionFunctions");

const enviroment = 'CRAFT' // 'CRAFT', 'DEV' o 'PROD';

let AWSConfig, Contracts_Table, ContractUser_Table, EvoGW_Table, S3_Bucket;

if(enviroment === 'CRAFT'){
    AWSConfig = {
        accessKeyId: process.env.OB_ACCESSKEY,
        secretAccessKey: process.env.OB_SECRETKEY,
        region: 'us-west-2',
        userPoolClient: '77sklsjs13appqu193ielgnk95',
        userPoolId: 'us-west-2_JQ2ETY08M'
    }
    Contracts_Table = 'contracts_contracts';
    ContractUser_Table = "contracts_users";
    EvoGW_Table = "evo_gw_merchant_id-craft";
    S3_Bucket = 'craft-archivos.dashboard.pagofacil.org-pf' || process.env.S3_BUCKET;

} else if (enviroment === 'DEV'){
    AWSConfig = {
        accessKeyId: process.env.OB_ACCESSKEY,
        secretAccessKey: process.env.OB_SECRETKEY,
        region: 'us-west-2',
        userPoolClient: '6miu193ul8g950sst64249v4im',
        userPoolId: 'us-west-2_J8c7BHK1F',
    }
    Contracts_Table = 'contracts_contracts';
    ContractUser_Table = "contracts_users";
    EvoGW_Table = "evo_gw_merchant_id-dev";
    S3_Bucket = 'archivos.dashboard.pagofacil.org' || process.env.S3_BUCKET;
} else if (enviroment === 'PROD'){
    AWSConfig = {
        accessKeyId: process.env.OB_ACCESSKEY,
        secretAccessKey: process.env.OB_SECRETKEY,
        region: 'us-west-2',
        userPoolClient: '6miu193ul8g950sst64249v4im',
        userPoolId: 'us-west-2_J8c7BHK1F',
    }
    Contracts_Table = 'contracts_contracts';
    ContractUser_Table = "contracts_users";
    EvoGW_Table = "evo_gw_merchant_id-prod";
    S3_Bucket = 'archivos.dashboard.pagofacil.org' || process.env.S3_BUCKET;
}

AWS.config.update({
  region: AWSConfig.region
});

const S3 = new AWS.S3({apiVersion: '2006-03-01'});

class BaseClass {

    aLogger = new AgentLogger();

    constructor(props) {
        this.props = props.reduce((newProps, prop, index) => {
            newProps[`param${index + 1}`] = prop
            return newProps
        }, {});
    }

    getdatetime() {
        let date = new Date();
        return date.toISOString();
    }
}

class CreateAccount extends BaseClass {

    clientCognito;

    constructor(props) {
        super(props);
        this.aLogger.trace('Generando conexion con Cognito');
        this.aLogger.trace(`region: ${AWSConfig.region}`);
        this.aLogger.trace(`userPoolId: ${AWSConfig.userPoolId}`);
        this.aLogger.trace(`userPoolClient: ${AWSConfig.userPoolClient}`);
        this.clientCognito = new CognitoIdentityProviderClient({
            region: AWSConfig.region
        });
    }

    async apply(contexts) {

        const {param1: username, param2: rut} = this.props
        const {registry: {logPrefix}} = contexts

        let requestUsername = (await this.accessor.get(username, contexts)).trim();
        let requestRut = await this.accessor.get(rut, contexts);
        let builtPassword = buildPwd(requestUsername, requestRut);

        this.aLogger.trace(`requestUsername "${requestUsername}" `);
        this.aLogger.trace(`requestRut "${requestRut}" `);
        this.aLogger.trace(`finalPassword "${builtPassword}" `);

        try {
            //Se crea cuenta en AWS Cognito
            const userSub = await this.create(requestUsername, builtPassword);
            this.aLogger.trace(`UserSub: "${userSub}" `);

            //Se confirma cuenta y correo
            const confirmResult = await this.confirm(requestUsername);
            this.aLogger.trace(`ConfirmResult: "${confirmResult}" `);
            return userSub;

        } catch (e) {
            this.aLogger.error(`Error en creacion de cuenta: ${e.message}`);
            return undefined;
        }
    }

    async create(username, password) {

        const clientPoolId = AWSConfig.userPoolClient;


        const input = {
            ClientId: clientPoolId,
            Username: username,
            Password: password
        };

        this.aLogger.trace(`Generando request para creacion de user: ${JSON.stringify(input)}`)

        const {UserSub} = await this.clientCognito.send(new SignUpCommand(input));
        return UserSub;
    }

    async confirm(username) {
        const confirmInput = {
            UserPoolId: AWSConfig.userPoolId,
            Username: username
        };

        this.aLogger.trace(`Generando request para confirmacion de user: ${JSON.stringify(confirmInput)}`);

        const emailConfirmInput = {
            UserPoolId: AWSConfig.userPoolId,
            Username: username,
            UserAttributes: [{
                Name: "email_verified",
                Value: "true"
            }]
        }

        this.aLogger.trace(`Generando request para confirmacion de e-mail: ${JSON.stringify(emailConfirmInput)}`);


        try {
            await this.clientCognito.send(new AdminUpdateUserAttributesCommand(emailConfirmInput));
            this.aLogger.trace(`${username} confirmacion email OK`);
        } catch (e) {
            this.aLogger.error(`Ocurrio un error al confirmar el email de ${username}. ${e.message}`);
            throw e;
        }

        try {
            await this.clientCognito.send(new AdminConfirmSignUpCommand(confirmInput));
            this.aLogger.trace(`${username} confirmacion de cuenta OK`);
        } catch (e) {
            this.aLogger.error(`Ocurrio un error al confirmar la cuenta el user ${username}. ${e.message}`);
            throw e;
        }

        return 'Success';
    }

}

class InsertEVOGW extends BaseClass {
    async apply(contexts) {
        const {param1: affiliation, param2: idgiro, param3: urlservicio, param4: nombrecomercio, param5:idservicio} = this.props
        const {registry: {logPrefix}} = contexts

        this.aLogger.trace(`Generando insercion en Dynamodb, tabla "${EvoGW_Table}" `);

        let reqAffiliation = await this.accessor.get(affiliation, contexts);
        let reqIdGiro = await this.accessor.get(idgiro, contexts);
        //Valida longitud idGiro
        reqIdGiro = transformNumberToStringWithLeadingZeros(reqIdGiro);
        let reqUrlServicio = await this.accessor.get(urlservicio, contexts);
        let reqNombreComercio = await this.accessor.get(nombrecomercio, contexts);
        let reqIdServicio = await this.accessor.get(idservicio, contexts);

        this.aLogger.trace(`reqAffiliation "${reqAffiliation}" `);
        this.aLogger.trace(`reqIdGiro "${reqIdGiro}" `);
        this.aLogger.trace(`reqUrlServicio "${reqUrlServicio}" `);
        this.aLogger.trace(`reqNombreComercio "${reqNombreComercio}" `);
        this.aLogger.trace(`reqIdServicio "${reqIdServicio}" `);

        // Crea una instancia de DynamoDB
        const dynamoDB = new AWS.DynamoDB.DocumentClient();

        // Define el nombre de la tabla y el objeto que quieres insertar
        const tableName = EvoGW_Table;
        const item = {
            "merchant_id": reqAffiliation,
            "branch_identification": "Pagofacil",
            "country": "CHL",
            "merchant_category_code": reqIdGiro, // es el Giro que se tiene mapeado con mercury
            "merchant_url": reqUrlServicio || "https://www.pagofacil.cl/", // url del servicio
            "name": reqNombreComercio, // nombre del comercio
            "pos_identification": "Pagofacil-10", // constante
            "psp": "00", // constante
            "service_id": reqIdServicio, // service id
            "show_contract": false, // constante
            "system_identification": "PFV1.0.0" // constante
        };

        // Crea un objeto de parámetros para la operación de inserción
        const params = {
            TableName: tableName,
            Item: item
        };

        this.aLogger.trace(`Insertando en DynamoDB: ${JSON.stringify(params)}`);

        try {
            const data = await dynamoDB.put(params).promise();
            this.aLogger.info(`Elemento insertado con éxito en la tabla ${tableName}: `+ JSON.stringify(data, null, 2));
            return data;
        } catch (error) {
            this.aLogger.error(`Error al insertar el elemento en la tabla ${tableName}: `+ JSON.stringify(error, null, 2));
            return 0;
        }

    }
}

class UpdateEVOGW extends BaseClass {
    async apply(contexts) {
        const {param1: affiliation, param2: idgiro, param3: urlservicio, param4: nombrecomercio, param5:idservicio} = this.props
        const {registry: {logPrefix}} = contexts

        this.aLogger.trace(`Generando actualización en Dynamodb, tabla "${EvoGW_Table}" `);

        let reqAffiliation = await this.accessor.get(affiliation, contexts);
        let reqIdGiro = await this.accessor.get(idgiro, contexts);
        //Valida longitud idGiro
        reqIdGiro = transformNumberToStringWithLeadingZeros(reqIdGiro);
        let reqUrlServicio = await this.accessor.get(urlservicio, contexts);
        let reqNombreComercio = await this.accessor.get(nombrecomercio, contexts);
        let reqIdServicio = await this.accessor.get(idservicio, contexts);

        this.aLogger.trace(`reqAffiliation "${reqAffiliation}" `);
        this.aLogger.trace(`reqIdGiro "${reqIdGiro}" `);
        this.aLogger.trace(`reqUrlServicio "${reqUrlServicio}" `);
        this.aLogger.trace(`reqNombreComercio "${reqNombreComercio}" `);
        this.aLogger.trace(`reqIdServicio "${reqIdServicio}" `);

        // Crea una instancia de DynamoDB
        const dynamoDB = new AWS.DynamoDB.DocumentClient();

        // Define el nombre de la tabla y los atributos a actualizar
        const tableName = EvoGW_Table;
        const updateExpression = 'SET merchant_category_code = :mcc, merchant_url = :url, #name = :name, service_id = :sid';
        const expressionAttributeNames = {
            '#name': 'name'
        };
        const expressionAttributeValues = {
            ':mcc': reqIdGiro,
            ':url': reqUrlServicio || "https://www.pagofacil.cl/",
            ':name': reqNombreComercio,
            ':sid': reqIdServicio
        };

        // Crea un objeto de parámetros para la operación de actualización
        const params = {
            TableName: tableName,
            Key: {
                'merchant_id': reqAffiliation
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues
        };

        this.aLogger.trace(`Actualizando en DynamoDB: ${JSON.stringify(params)}`);

        try {
            const data = await dynamoDB.update(params).promise();
            this.aLogger.info(`Elemento actualizado con éxito en la tabla ${tableName}: `+ JSON.stringify(data, null, 2));
            return data;
        } catch (error) {
            this.aLogger.error(`Error al actualizar el elemento en la tabla ${tableName}: `+ JSON.stringify(error, null, 2));
            return 0;
        }
    }
}

class InsertContractUser extends BaseClass {
    async apply(contexts) {
        const { param1: dbConnName, param2: inputIdUsuario, param3: inputDatosFacturacion, param4: inputUsersExtraData } = this.props
        const {
            registry: { logPrefix },
        } = contexts

        let idUsuario = await this.accessor.get(inputIdUsuario, contexts);
        let billingData = await this.accessor.get(inputDatosFacturacion, contexts);
        let usersExtra = await this.accessor.get(inputUsersExtraData, contexts);

        this.aLogger.trace(`idUsuario "${idUsuario}" `);
        this.aLogger.trace(`billingData "${billingData}" `);
        this.aLogger.trace(`usersExtra "${usersExtra}" `);

        if (!this.dbConnections[dbConnName]) throw new Error(`The db connection with id ${dbConnName} is not present. Create it first!`)

        const dbConn = this.dbConnections[dbConnName];

        try {

            //Se obtiene contrato default para cada caso
            let rows = await dbConn.db( Contracts_Table ).select().where({isDefault: 1, type: billingData.isCompany === 1? 'COMPANY':'PERSONAL'});
            const actualDefaultContract = rows[0];

            //Se definen parametros para contrato
            const newContract = {
                idUsuario: idUsuario,
                idContract: actualDefaultContract.id
            }

            const contenidoContract = await this.getContractData(actualDefaultContract, billingData, usersExtra, true);

            //Se genera el nombre del archivo
            let currentDate = new Date();
            let date = String(currentDate.getDate()).padStart(2, '0');
            let month = String(currentDate.getMonth() + 1).padStart(2, '0');
            let year = currentDate.getFullYear();
            const contractName = `${idUsuario}-${actualDefaultContract.id}-${date}-${month}-${year}`;
            newContract.path = await this.uploadContractS3(contractName, contenidoContract);
            newContract.status = 'SIGNED';

            this.aLogger.trace(`Performing a INSERT query over ${ContractUser_Table} with values ${JSON.stringify(newContract)}`, { logPrefix })
            const result = await dbConn.db(ContractUser_Table).insert(newContract);

            return result && result.length > 0 ? result[0] : 0;
        }catch (e){
            this.aLogger.error(e);
        }
    }

    async getContractData(actualDefaultContract, billingData, userExtraData, uploadS3 = false) {

        let contractData = {
            "VERSION": actualDefaultContract["version"],
            "razonSocial": billingData['razonSocial'],
            "fecha": new Date().toISOString().slice(0, 10),  // 'YYYY-MM-DD' format
            "rut": billingData['rut'],
            "direccion": billingData['direccion'] || billingData['comuna'] || billingData['ciudad'] || '',
            "nombre": userExtraData['nombre'],
            "apellido": userExtraData['apellido'],
            "nombreRepresentante": billingData['nombreRepresentante'],
            "rutRepresentante": billingData['rutRepresentante']
        };

        this.aLogger.trace(`Generando contrato con: ${JSON.stringify(contractData)}`);

        let keys = [];
        let values = [];

        const getParams = {
            Bucket: S3_Bucket,
            Key: actualDefaultContract['path'].toString()
        }

        let docHtmlAsText;
        try {
            docHtmlAsText = await S3.getObject(getParams).promise()
              .then(data => data.Body.toString('utf-8'));
        } catch (err) {
            this.aLogger.error(err);
            return "";
        }

        for (let key in contractData) {
            keys.push(new RegExp("{{" + key + "}}", "g"));
            values.push(contractData[key]);
        }

        if (!uploadS3) {
            keys.push(/body class="c13"/g);
            keys.push(/body class="c14"/g);
            values.push('body');
            this.aLogger.trace("KEYS ", keys);
        }

        for (let i = 0; i < keys.length; i++) {
            docHtmlAsText = docHtmlAsText.replace(keys[i], values[i]);
        }

        return docHtmlAsText;
    }

    async uploadContractS3(fileName, content) {
        const defaultFolder = 'Contracts-Users';
        const fullPathS3 = `${defaultFolder}/${fileName}.pdf`;

        // Genera el PDF
        const pdfBuffer = await this.createPDF(content);

        try {
            await S3.putObject({
                Bucket: S3_Bucket,
                Key: fullPathS3,
                Body: pdfBuffer,
                ContentLength: pdfBuffer.length,
                ContentType: 'application/pdf',
            }).promise();
        } catch (e) {
            console.log("There was an error uploading your file: ", e);
            throw e;
        }

        return fullPathS3;
    }

    async createPDF(html) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        await page.emulateMediaType('screen');
        const pdf = await page.pdf({ format: 'A4' });

        await browser.close();
        return pdf;
    }
}

class GetCurrentTimestamp extends BaseClass {
    async apply(contexts) {
        const date = new Date();
        return Math.floor(date.getTime() / 1000);
    }
}

class Deserialize extends BaseClass {

    async apply(contexts) {

        const {param1: data} = this.props
        const {registry: {logPrefix}} = contexts

        let dataDec = await this.accessor.get(data, contexts);

        return JSON.parse(dataDec);
    }
}

function buildPwd(username, rut) {
    const usernameCap = username.split('@')[0].toLowerCase();
    const rutSinDigito = rut.split('-')[0];

    let password = `${usernameCap}_${rutSinDigito}`;
    return password.charAt(0).toUpperCase() + password.slice(1).toLowerCase();

}

function transformNumberToStringWithLeadingZeros(number) {
    let numberString = number.toString();
    if (numberString.length < 4) {
        const zerosToAdd = 4 - numberString.length;
        numberString = '0'.repeat(zerosToAdd) + numberString;
    }
    return numberString;
}

exports.CreateAccount = CreateAccount;
exports.GetCurrentTimestamp = GetCurrentTimestamp;
exports.Deserialize = Deserialize;
exports.InsertEVOGW = InsertEVOGW;
exports.UpdateEVOGW = UpdateEVOGW;
exports.InsertContractUser = InsertContractUser;
