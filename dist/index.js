"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Interaction_1 = __importDefault(require("./Interaction"));
var Read_1 = __importDefault(require("./Read"));
var consoleStyle_1 = __importDefault(require("./consoleStyle"));
var utils_1 = require("./utils");
var Write_1 = __importDefault(require("./Write"));
var path = require('path');
var fileNameQuestion = {
    question: "请输入文件/文件夹名字(多级路径以'/'隔开)\n",
    paramName: 'fileName',
};
var CvScript = /** @class */ (function () {
    function CvScript(_a) {
        var questions = _a.questions, distPath = _a.distPath, templateDirPath = _a.templateDirPath, templateFilePath = _a.templateFilePath, fileDataMaps = _a.fileDataMaps, filterSelectTemplate = _a.filterSelectTemplate, mapWriteFile = _a.mapWriteFile;
        this.isCvDir = false;
        if (utils_1.isUndef(templateFilePath) && utils_1.isUndef(templateDirPath)) {
            throw new Error('请提供模板文件或模板文件夹的目录。');
        }
        if (!Read_1.default.IsExist(distPath)) {
            throw new Error('distPath不存在！');
        }
        this.customInteraction = new Interaction_1.default(__spreadArrays([fileNameQuestion], (questions || [])));
        // 当文件夹模板地址和文件模板地址同时存在，则需要询问用户要拷贝哪种。
        if (!utils_1.isUndef(templateFilePath) && !utils_1.isUndef(templateDirPath)) {
            this.isCvDirInteraction = new Interaction_1.default([{
                    question: [['文件', '文件夹'], '请问您需要拷贝文件还是文件夹？（文件夹只支持单层）'],
                    paramName: 'isCvDir',
                    type: 'select',
                }]);
        }
        if (!utils_1.isUndef(templateDirPath)) {
            this.readDir = new Read_1.default(templateDirPath);
        }
        if (!utils_1.isUndef(templateFilePath)) {
            this.readFile = new Read_1.default(templateFilePath);
        }
        if (utils_1.isUndef(this.isCvDirInteraction)) {
            this.isCvDir = !!this.readDir;
        }
        this.distPath = distPath;
        this.fileDataMaps = fileDataMaps || [];
        this.filterSelectTemplate = filterSelectTemplate;
        this.mapWriteFile = mapWriteFile;
    }
    CvScript.prototype.start = function () {
        if (this.isCvDirInteraction instanceof Interaction_1.default) {
            this.isCvDirInteraction.start();
            this.isCvDir = this.isCvDirInteraction.getValue().isCvDir === 1;
        }
        console.log(consoleStyle_1.default.blue, '请选择模板');
        var template = this.startToGetTemp();
        var templates = this.startRead(template);
        // console.log(templates)
        this.startWrite(templates);
    };
    CvScript.prototype.startToGetTemp = function () {
        var tempList = [];
        var tempPathList = [];
        if (this.isCvDir) {
            tempList = this.readDir.getSubDirNameList();
            tempPathList = this.readDir.getSubDirList();
        }
        else {
            tempList = this.readFile.getSubFileNameList();
            tempPathList = this.readFile.getSubFileList();
        }
        if (tempList.length === 0) {
            throw new Error("\u5F53\u524D\u63D0\u4F9B\u7684\u6A21\u677F\u76EE\u5F55\u4E0B\uFF0C\u65E0\u53EF\u7528" + (this.isCvDir ? '文件夹' : '文件') + "\uFF01");
        }
        var templates = tempList.map(function (t, i) { return ({ templateName: t, templatePath: tempPathList[i] }); });
        if (!utils_1.isUndef(this.filterSelectTemplate)) {
            templates = this.filterSelectTemplate(templates);
            if (templates.length === 0) {
                throw new Error("\u5F53\u524D\u63D0\u4F9B\u7684\u6A21\u677F\u76EE\u5F55\u4E0B\uFF0C\u65E0\u53EF\u7528" + (this.isCvDir ? '文件夹' : '文件') + "\uFF01");
            }
        }
        var selectTempInteractive = new Interaction_1.default([{
                question: [templates.map(function (t) { return t.templateName; }), '请选择模板'],
                paramName: 'targetTemp',
                type: 'select',
            }]);
        selectTempInteractive.start();
        return templates[selectTempInteractive.getValue().targetTemp];
    };
    CvScript.prototype.startRead = function (template) {
        var templates = this.getTemplatePath(template);
        return templates.map(function (temp) { return (__assign(__assign({}, temp), { data: Read_1.default.GetFileData(temp.templatePath) })); });
    };
    CvScript.prototype.startWrite = function (templates) {
        var _this = this;
        this.customInteraction.start();
        var customParams = this.customInteraction.getValue();
        var fileName = customParams.fileName;
        var writeFiles = templates.map(function (t) { return (__assign(__assign({}, t), { distPath: _this.distPath, fileName: fileName, isCvDir: _this.isCvDir })); });
        if (!utils_1.isUndef(this.mapWriteFile)) {
            writeFiles = this.mapWriteFile(writeFiles, customParams, this.isCvDir);
            if (writeFiles.length === 0) {
                throw new Error('after map write file: 没有可以写的文件对象。');
            }
        }
        writeFiles.forEach(function (wf) {
            var filePath = wf.distPath;
            if (wf.isCvDir) {
                // 当前是拷贝的目录
                var dirName = wf.fileName;
                Write_1.default.mkdir(wf.distPath, dirName);
                // 需要创建多级文件
                if (dirName.indexOf('/') > -1) {
                    filePath = path.join.apply(path, __spreadArrays([filePath], dirName.split('/')));
                }
                else {
                    filePath = path.join(filePath, dirName);
                }
                var targetFilePath = path.join(filePath, wf.templateName);
                Write_1.default.write(targetFilePath, wf, _this.fileDataMaps, customParams);
            }
            else {
                // let filePath = wf.distPath;
                // 需要创建多级文件
                if (fileName.indexOf('/') > -1) {
                    var fileDir = fileName.split('/');
                    fileDir.pop();
                    Write_1.default.mkdir(wf.distPath, fileDir.join(''));
                    filePath = path.join.apply(path, __spreadArrays([filePath], fileName.split('/')));
                }
                else {
                    filePath = path.join(filePath, fileName);
                }
                var fileExtension = wf.templateName.match(/\.\w+$/)[0];
                var targetFilePath = filePath + fileExtension;
                Write_1.default.write(targetFilePath, wf, _this.fileDataMaps, customParams);
            }
        });
        //
        // if(this.isCvDir) {
        //
        //     writeFiles.forEach(wf => {
        //         // 当前是拷贝的目录
        //         let filePath = wf.distPath;
        //         const dirName = wf.fileName;
        //         Write.mkdir(wf.distPath, dirName);
        //         // 需要创建多级文件
        //         if (dirName.indexOf('/') > -1) {
        //             filePath = path.join(filePath, ...dirName.split('/'));
        //         } else {
        //             filePath = path.join(filePath, dirName);
        //         }
        //         const targetFilePath = path.join(filePath, wf.templateName);
        //         Write.write(targetFilePath, wf, this.fileDataMaps, customParams);
        //     })
        //
        // } else {
        //     writeFiles.forEach(wf => {
        //         let filePath = wf.distPath;
        //         // 需要创建多级文件
        //         if (fileName.indexOf('/') > -1) {
        //             const fileDir = fileName.split('/');
        //             fileDir.pop();
        //             Write.mkdir(wf.distPath, fileDir.join(''));
        //             filePath = path.join(filePath, ...fileName.split('/'));
        //         } else {
        //             filePath = path.join(filePath, fileName);
        //         }
        //         const fileExtension: string = (wf.templateName.match(/\.\w+$/) as Array<string>)[0];
        //         const targetFilePath = filePath + fileExtension;
        //         Write.write(targetFilePath, wf, this.fileDataMaps, customParams);
        //     });
        //
        // }
    };
    CvScript.prototype.getTemplatePath = function (template) {
        if (this.isCvDir) {
            var res = this.readDir.getSubFileNameList(template.templatePath);
            return res.map(function (i) { return ({
                templatePath: path.join(template.templatePath, i),
                templateName: i,
            }); });
        }
        return [template];
    };
    return CvScript;
}());
exports.default = CvScript;
