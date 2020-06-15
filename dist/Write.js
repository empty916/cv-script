"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var consoleStyle_1 = __importDefault(require("./consoleStyle"));
var fs = require('fs');
var path = require('path');
var Write = /** @class */ (function () {
    function Write() {
    }
    Write.mkdir = function (dirPath, dirName) {
        if (dirName.indexOf('.') > -1) {
            console.log(consoleStyle_1.default.red, '文件名称不应该包含"."字符！');
            process.exit();
        }
        var dirPathNodes = dirName.split('/');
        var isFinalDirExist = fs.existsSync(path.join.apply(path, __spreadArrays([dirPath], dirPathNodes)));
        if (isFinalDirExist) {
            return;
        }
        var pathNode = dirPathNodes[0];
        var fileDirPath = path.join(dirPath, pathNode);
        var isExist = fs.existsSync(fileDirPath);
        if (!isExist) {
            fs.mkdirSync(fileDirPath);
        }
        if (dirPathNodes.length > 1) {
            return Write.mkdir(fileDirPath, dirPathNodes.slice(1).join('/'));
        }
    };
    Write.write = function (filePath, template, maps, params) {
        var fileData = maps.reduce(function (finalData, m) { return m(finalData, params, template); }, template.data);
        fs.writeFileSync(filePath, fileData, { encoding: 'utf-8' });
    };
    return Write;
}());
exports.default = Write;
