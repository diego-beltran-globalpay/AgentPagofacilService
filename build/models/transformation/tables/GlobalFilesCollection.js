"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalTablesCollection = void 0;
const FilesCollection_1 = require("../../fileLoader/FilesCollection");
class GlobalTablesCollection {
}
exports.GlobalTablesCollection = GlobalTablesCollection;
GlobalTablesCollection.init = (filesIds, filesPath, filesEncoding) => {
    if (!GlobalTablesCollection.filesCollection)
        GlobalTablesCollection.filesCollection = new FilesCollection_1.FilesCollection(filesIds, filesPath, filesEncoding);
};
GlobalTablesCollection.isInited = () => !!GlobalTablesCollection.filesCollection;
GlobalTablesCollection.get = () => {
    if (!GlobalTablesCollection.filesCollection)
        throw new Error("The files collection is not initialized yet");
    return GlobalTablesCollection.filesCollection;
};
