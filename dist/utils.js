"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObj = function (value) { return typeof value === 'object' && value !== null; };
exports.isUndef = function (value) { return value === undefined; };
exports.isString = function (value) { return typeof value === 'string'; };
exports.isRegExp = function (value) { return value instanceof RegExp; };
exports.isFunc = function (value) { return typeof value === 'function'; };
