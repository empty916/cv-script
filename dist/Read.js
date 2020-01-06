"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var consoleStyle_1 = __importDefault(require("./consoleStyle"));
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var Read = /** @class */ (function () {
    function Read(templateDir) {
        var templateFileIsExist = this.isExist(templateDir);
        if (!templateFileIsExist) {
            console.log(consoleStyle_1.default.red, "\u6A21\u677F\u76EE\u5F55\uFF1A" + templateDir + "\u4E0D\u5B58\u5728!");
            process.exit();
        }
        this.dir = templateDir;
    }
    Read.IsExist = function (dir) {
        return fs.existsSync(dir);
    };
    Read.prototype.isExist = function (dir) {
        return fs.existsSync(dir);
    };
    Read.prototype.getSubList = function (p) {
        if (p === void 0) { p = this.dir; }
        return fs.readdirSync(p, { withFileTypes: true });
    };
    Read.prototype.getSubDirList = function (p) {
        var _this = this;
        if (p === void 0) { p = this.dir; }
        return this.getSubList(p)
            .filter(function (i) { return i.isDirectory(); })
            .map(function (i) { return path.join(_this.dir, i.name); });
    };
    Read.prototype.getSubDirNameList = function (p) {
        if (p === void 0) { p = this.dir; }
        return this.getSubList(p)
            .filter(function (i) { return i.isDirectory(); })
            .map(function (i) { return i.name; });
    };
    Read.prototype.getSubFileList = function (p) {
        var _this = this;
        if (p === void 0) { p = this.dir; }
        return this.getSubList(p)
            .filter(function (i) { return !i.isDirectory(); })
            .map(function (i) { return path.join(_this.dir, i.name); });
    };
    Read.prototype.getSubFileNameList = function (p) {
        if (p === void 0) { p = this.dir; }
        return this.getSubList(p)
            .filter(function (i) { return !i.isDirectory(); })
            .map(function (i) { return i.name; });
    };
    Read.GetFileData = function (p) {
        return fs.readFileSync(p, { encoding: 'utf-8' });
    };
    Read.prototype.getFileData = function (p) {
        if (!this.isExist(p)) {
            console.log(consoleStyle_1.default.red, "\u6587\u4EF6" + p + "\u4E0D\u5B58\u5728!");
            process.exit();
        }
        return fs.readFileSync(p, { encoding: 'utf-8' });
    };
    return Read;
}());
exports.default = Read;
