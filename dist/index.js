"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Interactive_1 = __importDefault(require("./Interactive"));
var Read_1 = __importDefault(require("./Read"));
var consoleStyle_1 = __importDefault(require("./consoleStyle"));
var CvScript = /** @class */ (function () {
    function CvScript(qs, templateDir) {
        this.isCvDirInteractive = new Interactive_1.default([{
                question: [['文件', '文件夹'], '请问您需要拷贝文件还是文件夹？（文件夹只支持单层）'],
                paramName: 'isCvDir',
                check: function (v) {
                    if (v === -1) {
                        console.log(consoleStyle_1.default.red, '\n请选择1或者2');
                    }
                    return v !== -1;
                },
                type: 'select',
            }]);
        this.readDir = new Read_1.default(templateDir);
        this.interactive = new Interactive_1.default(qs);
    }
    CvScript.prototype.start = function () {
        this.isCvDirInteractive.start();
        var tempList = [];
        if (this.isCvDirInteractive.getValue().isCvDir === 0) {
            tempList = this.readDir.getSubFileNameList();
        }
        else {
            tempList = this.readDir.getSubDirNameList();
        }
        var selectTempInteractive = new Interactive_1.default([{
                question: [tempList, '请选择模板'],
                paramName: 'targetTemp',
                check: function (v) {
                    if (v === -1) {
                        console.log(consoleStyle_1.default.red, '\n请选择需要复制的模板');
                    }
                    return v !== -1;
                },
                type: 'select',
            }]);
        selectTempInteractive.start();
        console.log(selectTempInteractive.getValue());
        // this.interactive.start();
        // const params = this.interactive.getValue();
        // console.log(this.readDir.getSubDirList());
        // console.log(this.readDir.getSubDirNameList());
        // console.log(this.readDir.getSubFileList());
        // console.log(this.readDir.getSubFileNameList());
    };
    return CvScript;
}());
var templatePath = '/Users/wangxiaogang/Documents/github/cv-script/templates';
var cvs = new CvScript([
    {
        question: '请输入文件/文件夹名字\n',
        paramName: 'fileName',
        check: function (d) {
            var res = /^[a-z]+$/.test(d);
            if (!res) {
                console.log('请输入纯字母字符！\n');
            }
            return res;
        }
    },
], templatePath);
cvs.start();
// export default CvScript;
