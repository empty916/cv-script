import { Template } from './index';

const fs = require('fs');
const path = require('path');


type Params = {
    fileName: string;
}

export type FileDataMap<T extends {[k: string]: string;} = any> = (fileData: string, params: T & Params, template: Template) => string;


export default class Write {
    static mkdir(dirPath: string, dirName: string): void {
        if (dirName.indexOf('.') > -1) {
            throw new Error('文件名称不应该包含"."字符！');
        }
        const dirPathNodes = dirName.split('/');
        const pathNode = dirPathNodes[0];
        const fileDirPath = path.join(dirPath, pathNode);
        const isExist = fs.existsSync(fileDirPath);
        if (!isExist) {
            fs.mkdirSync(fileDirPath);
        }
        if (dirPathNodes.length > 1) {
            return Write.mkdir(fileDirPath, dirPathNodes.slice(1).join(''));
        }
    }
    static write(filePath: string, template: Template, maps: FileDataMap[], params: Params): void {
        const fileData = maps.reduce((finalData, m) => m(finalData, params, template), (template.data as string));
        fs.writeFileSync(filePath, fileData, {encoding: 'utf-8'});
    }
}
