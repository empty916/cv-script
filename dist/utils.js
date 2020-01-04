"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObj = function (value) { return typeof value === 'object' && value !== null; };
exports.isUndef = function (value) { return value === undefined; };
exports.isString = function (value) { return typeof value === 'string'; };
exports.isRegExp = function (value) { return value instanceof RegExp; };
exports.isFunc = function (value) { return typeof value === 'function'; };
exports.fileDataMap = function (fileData, params, template) {
    var lowerCaseModuleName = params.moduleName[0].toLowerCase() + params.moduleName.slice(1);
    var firstCharUpperCaseModuleName = params.moduleName[0].toUpperCase() + params.moduleName.slice(1);
    if (template.templateName.indexOf('.scss') > -1) {
        return fileData.replace(/template/g, params.fileName.replace(/\//g, '-'));
    }
    return fileData.replace(/Template/g, firstCharUpperCaseModuleName).replace(/template/g, lowerCaseModuleName);
};
exports.moduleNameQuestion = {
    question: '请输入模块名字\n',
    paramName: 'moduleName',
    check: function (d) {
        var res = /^[a-zA-Z0-9]+$/.test(d);
        if (!res) {
            console.log('请输入字母和数字的组合！\n');
        }
        return res;
    }
};
