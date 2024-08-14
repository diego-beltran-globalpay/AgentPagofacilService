"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datesFuncAvb = void 0;
const GetTime_1 = require("./GetTime");
const FormatDate_1 = require("./FormatDate");
const FormatDateTz_1 = require("./FormatDateTz");
const GetTimeTz_1 = require("./GetTimeTz");
const SetDateTime_1 = require("./SetDateTime");
const SetDateTimeTz_1 = require("./SetDateTimeTz");
const GetDate_1 = require("./GetDate");
exports.datesFuncAvb = {
    GetTime: GetTime_1.GetTime,
    FormatDate: FormatDate_1.FormatDate,
    FormatDateTz: FormatDateTz_1.FormatDateTz,
    GetTimeTz: GetTimeTz_1.GetTimeTz,
    SetDateTime: SetDateTime_1.SetDateTime,
    SetDateTimeTz: SetDateTimeTz_1.SetDateTimeTz,
    GetDate: GetDate_1.GetDate,
};
