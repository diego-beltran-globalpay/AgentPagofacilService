"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldOpFuncAvb = void 0;
const FloatToFixed_1 = require("./FloatToFixed");
const FixedToFloat_1 = require("./FixedToFloat");
const GetNextNumber_1 = require("./GetNextNumber");
const MaskString_1 = require("./MaskString");
const Padding_1 = require("./Padding");
const Substr_1 = require("./Substr");
const Substring_1 = require("./Substring");
const GetFieldLength_1 = require("./GetFieldLength");
const WriteIntNumber_1 = require("./WriteIntNumber");
const Split_1 = require("./Split");
const IndexOf_1 = require("./IndexOf");
const ConvertNumber_1 = require("./ConvertNumber");
const ConvertFormat_1 = require("./ConvertFormat");
const GetEBCDICFromField_1 = require("./GetEBCDICFromField");
const GetBCDFromField_1 = require("./GetBCDFromField");
const GetArrayLength_1 = require("./GetArrayLength");
const SplitHex_1 = require("./SplitHex");
const NewArray_1 = require("./NewArray");
const NewObject_1 = require("./NewObject");
const GetFieldLengthByEncodingType_1 = require("./GetFieldLengthByEncodingType");
const RoundNumber_1 = require("./RoundNumber");
const GetNextNumberMc_1 = require("./GetNextNumberMc");
const TruncateNumber_1 = require("./TruncateNumber");
const PushToArray_1 = require("./PushToArray");
exports.fieldOpFuncAvb = {
    FloatToFixed: FloatToFixed_1.FloatToFixed,
    GetNextNumber: GetNextNumber_1.GetNextNumber,
    MaskString: MaskString_1.MaskString,
    Padding: Padding_1.Padding,
    Substr: Substr_1.Substr,
    Substring: Substring_1.Substring,
    FixedToFloat: FixedToFloat_1.FixedToFloat,
    GetFieldLength: GetFieldLength_1.GetFieldLength,
    WriteIntNumber: WriteIntNumber_1.WriteIntNumber,
    Split: Split_1.Split,
    IndexOf: IndexOf_1.IndexOf,
    ConvertNumber: ConvertNumber_1.ConvertNumber,
    ConvertFormat: ConvertFormat_1.ConvertFormat,
    GetEBCDICFromField: GetEBCDICFromField_1.GetEBCDICFromField,
    GetBCDFromField: GetBCDFromField_1.GetBCDFromField,
    GetArrayLength: GetArrayLength_1.GetArrayLength,
    SplitHex: SplitHex_1.SplitHex,
    NewArray: NewArray_1.NewArray,
    NewObject: NewObject_1.NewObject,
    GetFieldLengthByEncodingType: GetFieldLengthByEncodingType_1.GetFieldLengthByEncodingType,
    RoundNumber: RoundNumber_1.RoundNumber,
    GetNextNumberMc: GetNextNumberMc_1.GetNextNumberMc,
    TruncateNumber: TruncateNumber_1.TruncateNumber,
    PushToArray: PushToArray_1.PushToArray,
};
