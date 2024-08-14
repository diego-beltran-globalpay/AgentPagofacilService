"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomUtils = void 0;
class CustomUtils {
    static parseGroupIDs(groupIds) {
        if (!groupIds)
            return {};
        return groupIds.split("-").reduce((groupsIdsNew, valueToParse) => {
            const [endpointAddress, id] = valueToParse.split("|");
            groupsIdsNew[endpointAddress] = id;
            return groupsIdsNew;
        }, {});
    }
}
exports.CustomUtils = CustomUtils;
