"use strict";
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
        && utils_1.isFunc(obj.check)
        && (utils_1.isUndef(obj.type) || (obj.type === 'input' || obj.type === 'select'));
};
/**
 * 交互类
 * 处理用户在控制台的交互
 */
var Interactive = /** @class */ (function () {
    function Interactive(questions) {
        this.questions = [];
        this.params = {};
        this.isComplete = false;
        questions.forEach(function (q) {
            if (isQuestionType(q) === false) {
                throw new Error('question is invalid! question must be like [{question, paramName, check}]');
            }
        });
        this.questions = questions;
    }
    Interactive.prototype.start = function () {
        for (var i = 0; i < this.questions.length; i++) {
            var q = this.questions[i];
            if (utils_1.isUndef(this.params[q.paramName])) {
                var value = null;
                if (q.type !== 'select') {
                    value = readlineSync.question(q.question);
                }
                else {
                    value = readlineSync.keyInSelect.apply(readlineSync, q.question);
                }
                if (q.check(value)) {
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
    Interactive.prototype.getValue = function () {
        if (!this.isComplete) {
            console.warn(consoleStyle_1.default.yellow, '用户数据还未采集完成！');
        }
        return this.params;
    };
    return Interactive;
}());
exports.default = Interactive;
