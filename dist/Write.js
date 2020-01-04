"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var Write = /** @class */ (function () {
    function Write() {
    }
    Write.mkdir = function (dirPath, dirName) {
        if (dirName.indexOf('.') > -1) {
            throw new Error('文件名称不应该包含"."字符！');
        }
        var dirPathNodes = dirName.split('/');
        var pathNode = dirPathNodes[0];
        var fileDirPath = path.join(dirPath, pathNode);
        var isExist = fs.existsSync(fileDirPath);
        if (!isExist) {
            fs.mkdirSync(fileDirPath);
        }
        if (dirPathNodes.length > 1) {
            return Write.mkdir(fileDirPath, dirPathNodes.slice(1).join(''));
        }
    };
    Write.write = function (filePath, template, maps, params) {
        var fileData = maps.reduce(function (finalData, m) { return m(finalData, params, template); }, template.data);
        fs.writeFileSync(filePath, fileData, { encoding: 'utf-8' });
    };
    return Write;
}());
exports.default = Write;
