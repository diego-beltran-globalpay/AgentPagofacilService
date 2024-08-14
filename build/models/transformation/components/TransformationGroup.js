"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformationGroup = void 0;
const TransformationUnit_1 = require("./TransformationUnit");
class TransformationGroup {
    constructor(group) {
        this.group = group;
    }
    static fromObject(groupJson, extFunction) {
        const group = {};
        for (const name in groupJson) {
            group[name] = TransformationUnit_1.TransformationUnit.fromObject(groupJson[name], extFunction);
        }
        return new TransformationGroup(group);
    }
}
exports.TransformationGroup = TransformationGroup;
