import Interaction, {Question} from './Interaction'
import Read from "./Read";
import consoleStyle from "./consoleStyle";
import {isUndef} from "./utils";
import Write, { FileDataMap } from "./Write";

const path = require('path');

export {FileDataMap} from './Write'
export {Question} from './Interaction'

export type CvScriptConstructor = ({
    templateDirPath: string,
    templateFilePath?: string,
} | {
    templateDirPath?: string,
    templateFilePath: string,
}) & {
    questions: Question[],
    distPath: string,
    fileDataMaps?: FileDataMap[]
};

export type Template = {
    templateName: string,
    templatePath: string,
    data?: string,
}

const fileNameQuestion = {
    question: "请输入文件/文件夹名字(多级路径以'/'隔开)\n",
    paramName: 'fileName',
};

export default class CvScript {
    readDir: Read | undefined;
    readFile: Read | undefined;
    customInteraction: Interaction;
    isCvDir = false;
    isCvDirInteraction: Interaction | undefined;
    distPath: string;
    fileDataMaps: FileDataMap[];

    constructor({
        questions,
        distPath,
        templateDirPath,
        templateFilePath,
        fileDataMaps,
    }: CvScriptConstructor) {
        if (isUndef(templateFilePath) && isUndef(templateDirPath)) {
            throw new Error('请提供模板文件或模板文件夹的目录。')
        }
        if (!Read.IsExist(distPath)) {
            throw new Error('distPath不存在！');
        }
        this.customInteraction = new Interaction([fileNameQuestion, ...questions]);
        // 当文件夹模板地址和文件模板地址同时存在，则需要询问用户要拷贝哪种。
        if (!isUndef(templateFilePath) && !isUndef(templateDirPath)) {
            this.isCvDirInteraction = new Interaction([{
                question: [['文件', '文件夹'], '请问您需要拷贝文件还是文件夹？（文件夹只支持单层）'],
                paramName: 'isCvDir',
                type: 'select',
            }]);
        }

        if (!isUndef(templateDirPath)) {
            this.readDir = new Read(templateDirPath);
        }
        if (!isUndef(templateFilePath)) {
            this.readFile = new Read(templateFilePath);
        }
        if (isUndef(this.isCvDirInteraction)) {
            this.isCvDir = !!this.readDir;
        }
        this.distPath = distPath;
        this.fileDataMaps = fileDataMaps || [];
    }

    start():void {
        if (this.isCvDirInteraction instanceof  Interaction) {
            this.isCvDirInteraction.start();
            this.isCvDir = this.isCvDirInteraction.getValue().isCvDir === 1;
        }
        console.log(consoleStyle.blue, '请选择模板');
        const template = this.startToGetTemp();
        const templates = this.startRead(template);

        // console.log(templates)
        this.startWrite(templates);
    }
    startToGetTemp(): Template {
        let tempList: string[] = [];
        let tempPathList: string[] = [];
        if (this.isCvDir) {
            tempList = (this.readDir as Read).getSubDirNameList();
            tempPathList = (this.readDir as Read).getSubDirList();
        } else {
            tempList = (this.readFile as Read).getSubFileNameList();
            tempPathList = (this.readFile as Read).getSubFileList();
        }
        if (tempList.length === 0) {
            throw new Error(`当前提供的模板目录下，无可用${this.isCvDir ? '文件夹' : '文件'}！`);
        }
        const selectTempInteractive = new Interaction([{
            question: [tempList, '请选择模板'],
            paramName: 'targetTemp',
            type: 'select',
        }]);
        selectTempInteractive.start();
        return {
            templateName: tempList[selectTempInteractive.getValue().targetTemp],
            templatePath: tempPathList[selectTempInteractive.getValue().targetTemp],
        };
    }
    startRead(template: Template): Template[] {
        const templates = this.getTemplatePath(template);
        return templates.map(temp => ({
            ...temp,
            data: Read.GetFileData(temp.templatePath),
        }));
    }
    startWrite(templates: Template[]) {
        this.customInteraction.start();
        const customParams: {
            fileName: string,
            [k: string]: string,
        } = this.customInteraction.getValue() as any;
        const { fileName } = customParams;
        if(this.isCvDir) {
            // 当前是拷贝的目录
            let filePath = this.distPath;
            const dirName = fileName;
            Write.mkdir(this.distPath, dirName);
            // 需要创建多级文件
            if (dirName.indexOf('/') > -1) {
                filePath = path.join(filePath, ...dirName.split('/'));
            } else {
                filePath = path.join(filePath, dirName);
            }
            templates.forEach(t => {
                const targetFilePath = path.join(filePath, t.templateName);
                Write.write(targetFilePath, t, this.fileDataMaps, customParams);
            })
        } else {
            let filePath = this.distPath;
            // 需要创建多级文件
            if (fileName.indexOf('/') > -1) {
                const fileDir = fileName.split('/');
                fileDir.pop();
                Write.mkdir(this.distPath, fileDir.join(''));
                filePath = path.join(filePath, ...fileName.split('/'));
            } else {
                filePath = path.join(filePath, fileName);
            }
            templates.forEach(t => {
                const fileExtension: string = (t.templateName.match(/\.\w+$/) as Array<string>)[0];
                const targetFilePath = filePath + fileExtension;
                Write.write(targetFilePath, t, this.fileDataMaps, customParams);
            })
        }
    }

    getTemplatePath(template: Template): Template[] {
        if (this.isCvDir) {
            const res: string[] = (this.readDir as Read).getSubFileNameList(template.templatePath);
            return res.map(i => ({
                templatePath: path.join(template.templatePath, i),
                templateName: i,
            }));
        }
        return [template];
    }
}

