"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObj = function (value) { return typeof value === 'object' && value !== null; };
exports.isUndef = function (value) { return value === undefined; };
exports.isString = function (value) { return typeof value === 'string'; };
exports.isRegExp = function (value) { return value instanceof RegExp; };
exports.isFunc = function (value) { return typeof value === 'function'; };
exports.firstCharToUpperCase = function (str) { return str[0].toUpperCase() + str.slice(1); };
exports.firstCharToLowerCase = function (str) { return str[0].toLowerCase() + str.slice(1); };
exports.fileDataMap = function (fileData, params, template) {
    var moduleName = params.moduleName, fileName = params.fileName;
    if (!moduleName) {
        moduleName = fileName.split(/[\/\-]/g).map(exports.firstCharToUpperCase).join('');
        moduleName = exports.firstCharToLowerCase(moduleName);
    }
    var lowerCaseModuleName = moduleName[0].toLowerCase() + moduleName.slice(1);
    var firstCharUpperCaseModuleName = moduleName[0].toUpperCase() + moduleName.slice(1);
    if (template.templateName.indexOf('.scss') > -1) {
        return fileData.replace(/template/g, fileName.replace(/\//g, '-'));
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
