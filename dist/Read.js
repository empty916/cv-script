"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var Read = /** @class */ (function () {
    function Read(templateDir) {
        var templateFileIsExist = this.isExist(templateDir);
        if (!templateFileIsExist) {
            throw new Error("\u6A21\u677F\u76EE\u5F55\uFF1A" + templateDir + "\u4E0D\u5B58\u5728!");
        }
        this.dir = templateDir;
    }
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
    return Read;
}());
exports.default = Read;
