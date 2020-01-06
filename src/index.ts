import Interaction, {Question} from './Interaction'
import Read from "./Read";
import consoleStyle from "./consoleStyle";
import {isUndef} from "./utils";
import Write, { FileDataMap, Params } from "./Write";

const path = require('path');

export {FileDataMap} from './Write'
export {Question} from './Interaction'


export type FilterSelectTemplate = (template: Template[]) => Template[];
export type MapWriteFile = (files: WriteFile[], params: Params & {[k: string]: string}, isCvDir: boolean) => WriteFile[];

export type CvScriptConstructor = ({
    templateDirPath: string,
    templateFilePath?: string,
} | {
    templateDirPath?: string,
    templateFilePath: string,
}) & {
    questions?: Question[],
    distPath: string,
    fileDataMaps?: FileDataMap[],
    filterSelectTemplate?: FilterSelectTemplate,
    mapWriteFile?: MapWriteFile,
};

export type Template = {
    templateName: string,
    templatePath: string,
    data?: string,
    distPath?: string,
    fileName?: string,
    isCvDir?: boolean,
}

export type WriteFile = Required<Template>;

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
    filterSelectTemplate: FilterSelectTemplate | undefined;
    mapWriteFile: MapWriteFile | undefined;

    constructor({
        questions,
        distPath,
        templateDirPath,
        templateFilePath,
        fileDataMaps,
        filterSelectTemplate,
        mapWriteFile,
    }: CvScriptConstructor) {
        if (isUndef(templateFilePath) && isUndef(templateDirPath)) {
            console.log(consoleStyle.red, '请提供模板文件或模板文件夹的目录。');
            process.exit();
        }
        if (!Read.IsExist(distPath)) {
            console.log(consoleStyle.red, 'distPath不存在！');
            process.exit();
        }
        this.customInteraction = new Interaction([fileNameQuestion, ...(questions || [])]);
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
        this.filterSelectTemplate = filterSelectTemplate;
        this.mapWriteFile = mapWriteFile;
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
            console.log(consoleStyle.red, `当前提供的模板目录下，无可用${this.isCvDir ? '文件夹' : '文件'}！`);
            process.exit();
        }

        let templates: Template[] = tempList.map((t, i) => ({templateName: t, templatePath: tempPathList[i]}));
        if (!isUndef(this.filterSelectTemplate)) {
            templates = this.filterSelectTemplate(templates);
            if (templates.length === 0) {
                console.log(consoleStyle.red, `当前提供的模板目录下，无可用${this.isCvDir ? '文件夹' : '文件'}！`);
                process.exit();
            }
        }

        const selectTempInteractive = new Interaction([{
            question: [templates.map(t => t.templateName), '请选择模板'],
            paramName: 'targetTemp',
            type: 'select',
        }]);
        selectTempInteractive.start();
        return templates[selectTempInteractive.getValue().targetTemp];
    }
    startRead(template: Template): (Template & {data: string})[] {
        const templates = this.getTemplatePath(template);
        return templates.map(temp => ({
            ...temp,
            data: Read.GetFileData(temp.templatePath),
        }));
    }
    checkFileIsExist(writeFiles: WriteFile[], fileName: string) {
        writeFiles.forEach(wf => {
            let filePath = wf.distPath;
            let targetFilePath = '';
            if (wf.isCvDir) {
                const dirName = wf.fileName;
                if (dirName.indexOf('/') > -1) {
                    filePath = path.join(filePath, ...dirName.split('/'));
                } else {
                    filePath = path.join(filePath, dirName);
                }
                targetFilePath = path.join(filePath, wf.templateName);
            } else {
                // 需要创建多级文件
                if (fileName.indexOf('/') > -1) {
                    const fileDir = fileName.split('/');
                    fileDir.pop();
                    filePath = path.join(filePath, ...fileName.split('/'));
                } else {
                    filePath = path.join(filePath, fileName);
                }
                const fileExtension: string = (wf.templateName.match(/\.\w+$/) as Array<string>)[0];
                targetFilePath = filePath + fileExtension;
            }

            if (Read.IsExist(targetFilePath)) {
                console.log(consoleStyle.red, `${filePath}文件已经存在! 程序已终止！`);
                process.exit();
            }
        })
    }
    startWrite(templates: (Template & {data: string})[]) {
        this.customInteraction.start();
        const customParams: {
            fileName: string,
            [k: string]: string,
        } = this.customInteraction.getValue() as any;
        const { fileName } = customParams;
        let writeFiles: WriteFile[] = templates.map(t => ({
            ...t,
            distPath: this.distPath,
            fileName,
            isCvDir: this.isCvDir,
        }));

        if (!isUndef(this.mapWriteFile)) {
            writeFiles = this.mapWriteFile(writeFiles, customParams, this.isCvDir);
            if (writeFiles.length === 0) {
                console.log(consoleStyle.red, 'after map write file: 没有可以写的文件对象。');
                process.exit();
            }
        }

        this.checkFileIsExist(writeFiles, fileName);

        writeFiles.forEach(wf => {

            let filePath = wf.distPath;
            if (wf.isCvDir) {
                // 当前是拷贝的目录
                const dirName = wf.fileName;
                Write.mkdir(wf.distPath, dirName);
                // 需要创建多级文件
                if (dirName.indexOf('/') > -1) {
                    filePath = path.join(filePath, ...dirName.split('/'));
                } else {
                    filePath = path.join(filePath, dirName);
                }
                const targetFilePath = path.join(filePath, wf.templateName);
                Write.write(targetFilePath, wf, this.fileDataMaps, customParams);
            } else {
                // 需要创建多级文件
                if (fileName.indexOf('/') > -1) {
                    const fileDir = fileName.split('/');
                    fileDir.pop();
                    Write.mkdir(wf.distPath, fileDir.join(''));
                    filePath = path.join(filePath, ...fileName.split('/'));
                } else {
                    filePath = path.join(filePath, fileName);
                }
                const fileExtension: string = (wf.templateName.match(/\.\w+$/) as Array<string>)[0];
                const targetFilePath = filePath + fileExtension;
                Write.write(targetFilePath, wf, this.fileDataMaps, customParams);
            }
        })
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

