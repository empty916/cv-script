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
var utils_1 = require("./utils");
var consoleStyle_1 = __importDefault(require("./consoleStyle"));
var readlineSync = require('readline-sync');
var path = require('path');
var isQuestionType = function (obj) {
    return utils_1.isObj(obj)
        && (utils_1.isString(obj.question) || Array.isArray(obj.question))
        && utils_1.isString(obj.paramName)
        && (utils_1.isFunc(obj.check) || utils_1.isUndef(obj.check))
        && (utils_1.isUndef(obj.type) || (obj.type === 'input' || obj.type === 'select'));
};
/**
 * 交互类
 * 处理用户在控制台的交互
 */
var Interaction = /** @class */ (function () {
    function Interaction(questions) {
        this.questions = [];
        this.params = {};
        this.isComplete = false;
        questions.forEach(function (q) {
            if (isQuestionType(q) === false) {
                throw new Error('question is invalid! question must be like [{question, paramName}]');
            }
        });
        this.questions = questions;
    }
    Interaction.prototype.start = function () {
        for (var i = 0; i < this.questions.length; i++) {
            var q = this.questions[i];
            if (utils_1.isUndef(this.params[q.paramName])) {
                var value = null;
                if (q.type !== 'select') {
                    value = readlineSync.question(q.question);
                }
                else {
                    value = readlineSync.keyInSelect.apply(readlineSync, __spreadArrays(q.question, [{ cancel: '退出' }]));
                }
                if (q.type === 'select' && value === -1) {
                    return process.exit();
                }
                if ((!!q.check && q.check(value)) || (!q.check && !utils_1.isUndef(value))) {
                    this.params[q.paramName] = value;
                    this.isComplete = (i === this.questions.length - 1);
                }
                else {
                    return this.start();
                }
            }
            this.isComplete = (i === this.questions.length - 1);
        }
    };
    Interaction.prototype.getValue = function () {
        if (!this.isComplete) {
            console.warn(consoleStyle_1.default.yellow, '用户数据还未采集完成！');
        }
        return this.params;
    };
    return Interaction;
}());
exports.default = Interaction;
