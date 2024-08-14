const { AgentLogger } = require("./ExtensionFunctions");

class BaseClass {

  aLogger = new AgentLogger();
  // Array de string parseados desde la llamada de la funcion dentro de las reglas de transformacion
  constructor(props) {
    this.props = props.reduce((newProps, prop, index) => {
      newProps[`param${index + 1}`] = prop
      return newProps
    }, {})
  }
}

class GetRecord extends BaseClass {
  async apply(contexts) {
    const { param1: dbConnName, param2: tableName, param3: sourceOrDest, param4: idsFieldNames, param5: valuesFieldNames } = this.props
    const {
      registry: { logPrefix },
    } = contexts

    if (!this.dbConnections[dbConnName]) throw new Error(`The db connection with id ${dbConnName} is not present. Create it first!`)

    // dbConn = { ready: boolean, db: { connection data } }
    const dbConn = this.dbConnections[dbConnName];

    const whereClause = {},
      idsFieldNamesArray = idsFieldNames.split("|"),
      valuesFieldNamesArray = valuesFieldNames.split("|")
    if (valuesFieldNamesArray.length !== idsFieldNamesArray.length)
      throw new Error(`The where columns qty [${idsFieldNamesArray.length}] are not the same to the values qty[${valuesFieldNamesArray.length}]`)

    for (let idNameIdx in idsFieldNamesArray) {
      let value = await this.accessor.get(valuesFieldNamesArray[idNameIdx], contexts)
      whereClause[idsFieldNamesArray[idNameIdx]] = value
    }

    this.aLogger.trace(`Performing a SELECT query over ${tableName} with [${JSON.stringify(whereClause)}]`)

    let rows;
    if ( !!dbConn.collection ) {
      rows = await dbConn.collection(tableName).findOne(whereClause);
      rows = [rows];
    } else {
      rows = await dbConn.db( tableName ).select().where( whereClause );
    }

    if (rows.length > 0) {
      this.aLogger.trace(`${rows.length} row/s found.`);
      if (this.accessor.static.isContextRefStrict(sourceOrDest)) {
        const dest = this.accessor.static.getReference(sourceOrDest, contexts)
        Object.assign(dest, rows[0])
      } else this.accessor.static.set(sourceOrDest, rows[0], contexts)
    } else {
      this.aLogger.trace("No register was found")
    }
  }
}

class GetRecords extends BaseClass {
  async apply(contexts) {
    const { param1: dbConnName, param2: tableName, param3: sourceOrDest, param4: idsFieldNames, param5: valuesFieldNames } = this.props
    const {
      registry: { logPrefix },
    } = contexts

    if (!this.dbConnections[dbConnName]) throw new Error(`The db connection with id ${dbConnName} is not present. Create it first!`)

    const dbConn = this.dbConnections[dbConnName]

    const whereClause = {},
      idsFieldNamesArray = idsFieldNames.split("|"),
      valuesFieldNamesArray = valuesFieldNames.split("|")
    if (valuesFieldNamesArray.length !== idsFieldNamesArray.length)
      throw new Error(`The where columns qty [${idsFieldNamesArray.length}] are not the same to the values qty[${valuesFieldNamesArray.length}]`)

    for (let idNameIdx in idsFieldNamesArray) {
      let value = await this.accessor.get(valuesFieldNamesArray[idNameIdx], contexts)
      whereClause[idsFieldNamesArray[idNameIdx]] = value
    }

    this.aLogger.trace(`Performing a SELECT query over ${tableName} with [${JSON.stringify(whereClause)}]`)

    const rows = await dbConn.db(tableName).select().where(whereClause)
    if (rows.length > 0) {
      this.aLogger.trace(`${rows.length} row/s found.`);
      this.accessor.static.set(sourceOrDest, rows, contexts)
    } else {
      this.aLogger.trace("No register was found")
    }
  }
}

class UpdateRecord extends BaseClass {
  async apply(contexts) {
    const { param1: dbConnName, param2: tableName, param3: sourceOrDest, param4: idsFieldNames, param5: valuesFieldNames } = this.props
    const {
      registry: { logPrefix },
    } = contexts

    if (!this.dbConnections[dbConnName]) throw new Error(`The db connection with id ${dbConnName} is not present. Create it first!`)

    const dbConn = this.dbConnections[dbConnName]

    const whereClause = {},
      idsFieldNamesArray = idsFieldNames.split("|"),
      valuesFieldNamesArray = valuesFieldNames.split("|")
    if (valuesFieldNamesArray.length !== idsFieldNamesArray.length)
      throw new Error(`The where columns qty [${idsFieldNamesArray.length}] are not the same to the values qty[${valuesFieldNamesArray.length}]`)

    for (let idNameIdx in idsFieldNamesArray) {
      let value = await this.accessor.get(valuesFieldNamesArray[idNameIdx], contexts)
      whereClause[idsFieldNamesArray[idNameIdx]] = value
    }

    const dataToUpdate = await this.accessor.get(sourceOrDest, contexts);

    this.aLogger.trace(`Performing a UPDATE query over ${tableName} with [${JSON.stringify(whereClause)}] with values [${JSON.stringify(dataToUpdate)}]`)

    if (typeof dataToUpdate !== "object") throw new Error(`The data to update the tables is not present.`)

    try {
      const result = await dbConn.db(tableName).update(dataToUpdate).where(whereClause).returning('id');
      this.aLogger.trace(`Update "${tableName}" OK: ${result.length} row/s updated.`);

      // Retornar el "id" del elemento actualizado
      if (result && result.length > 0) {
        return result[0].id;
      }
    }catch(e){
      this.aLogger.error(`An error occurred while trying to update the table "${tableName}": ${e.message}`)
    }
  }
}

class DeleteRecord extends BaseClass {
  async apply(contexts) {
    const { param1: dbConnName, param2: tableName, param3: idsFieldNames, param4: valuesFieldNames } = this.props
    const {
      registry: { logPrefix },
    } = contexts

    if (!this.dbConnections[dbConnName]) throw new Error(`The db connection with id ${dbConnName} is not present. Create it first!`)

    const dbConn = this.dbConnections[dbConnName]

    const whereClause = {},
      idsFieldNamesArray = idsFieldNames.split("|"),
      valuesFieldNamesArray = valuesFieldNames.split("|")
    if (valuesFieldNamesArray.length !== idsFieldNamesArray.length)
      throw new Error(`The where columns qty [${idsFieldNamesArray.length}] are not the same to the values qty[${valuesFieldNamesArray.length}]`)

    for (let idNameIdx in idsFieldNamesArray) {
      let value = await this.accessor.get(valuesFieldNamesArray[idNameIdx], contexts)
      whereClause[idsFieldNamesArray[idNameIdx]] = value
    }

    this.aLogger.trace(`Performing a DELETE query over ${tableName} with [${JSON.stringify(whereClause)}]`)
    await dbConn.db(tableName).delete().where(whereClause)
  }
}

class InsertRecord extends BaseClass {
  async apply(contexts) {
    const { param1: dbConnName, param2: tableName, param3: sourceOrDest } = this.props
    const {
      registry: { logPrefix },
    } = contexts

    if (!this.dbConnections[dbConnName]) throw new Error(`The db connection with id ${dbConnName} is not present. Create it first!`)

    const dbConn = this.dbConnections[dbConnName]

    const dataToInsert = await this.accessor.get(sourceOrDest, contexts)
    if (typeof dataToInsert !== "object") throw new Error(`The data to insert the tables is not present.`)

    this.aLogger.trace(`Performing a INSERT query over ${tableName} with values ${JSON.stringify(dataToInsert)}`)

    try {
      const result = await dbConn.db(tableName).insert(dataToInsert);
      const id = result && result.length > 0 ? result[0] : 0;

      return id;
    }catch (e){
      this.aLogger.error(e);
    }
  }
}

class saveInMemory extends BaseClass {
  async apply(contexts) {
    const { param1: msgKey } = this.props
    const { initialMessage, registry: { logPrefix }, } = contexts;

    this.aLogger.trace(`[ ExtendedContextManagement ] [ saveInMemory ] - Saving context with the key [ ${msgKey} ]`);
    if (msgKey && typeof msgKey === "string")
      InMemoryCtxsCollection_1.InMemoryCtxsCollection.getInstance("Default").addEntry(msgKey, initialMessage);
    else
      throw new Error("The required key to save message on context is not present");

  }
}

class readInMemory extends BaseClass {
  async apply(contexts) {
    const { param1: msgKey } = this.props
    const { initialMessage, registry: { logPrefix }, } = contexts;

    this.aLogger.trace(`[ ExtendedContextManagement ] [ readInMemory ] - Reading context with the key [ ${msgKey} ]`);
    if (msgKey && typeof msgKey === "string")
      InMemoryCtxsCollection_1.InMemoryCtxsCollection.getInstance("Default").addEntry(msgKey, initialMessage);
    else
      throw new Error("The required key to read message from memory is not present");

  }
}

exports.GetRecord = GetRecord;
exports.GetRecords = GetRecords;
exports.UpdateRecord = UpdateRecord;
exports.DeleteRecord = DeleteRecord;
exports.InsertRecord = InsertRecord;

exports.saveInMemory = saveInMemory;
exports.readInMemory = readInMemory;
