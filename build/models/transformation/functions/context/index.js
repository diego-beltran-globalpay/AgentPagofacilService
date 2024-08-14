"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextFuncAvb = void 0;
const GetContext_1 = require("./GetContext");
const SaveContext_1 = require("./SaveContext");
const GetContextV2_1 = require("./GetContextV2");
const SaveContextV2_1 = require("./SaveContextV2");
const UpdateContextV2_1 = require("./UpdateContextV2");
const GetAllContextV2_1 = require("./GetAllContextV2");
const ReadContextV2_1 = require("./ReadContextV2");
const DeleteContextV2_1 = require("./DeleteContextV2");
exports.contextFuncAvb = {
    GetContext: GetContext_1.GetContext,
    SaveContext: SaveContext_1.SaveContext,
    GetContextV2: GetContextV2_1.GetContextV2,
    SaveContextV2: SaveContextV2_1.SaveContextV2,
    UpdateContextV2: UpdateContextV2_1.UpdateContextV2,
    GetAllContextV2: GetAllContextV2_1.GetAllContextV2,
    ReadContextV2: ReadContextV2_1.ReadContextV2,
    DeleteContextV2: DeleteContextV2_1.DeleteContextV2,
};
