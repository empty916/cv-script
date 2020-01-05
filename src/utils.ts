import {FileDataMap} from "./Write";


export const isObj = (value: any): value is Object => typeof value === 'object' && value !== null;

export const isUndef = (value: any): value is undefined => value === undefined;

export const isString = (value: any): value is string => typeof value === 'string';

export const isRegExp = (value: any): value is RegExp => value instanceof RegExp;

export const isFunc = (value: any): value is Function => typeof value === 'function';

export const firstCharToUpperCase = (str: string) => str[0].toUpperCase() + str.slice(1);
export const firstCharToLowerCase = (str: string) => str[0].toLowerCase() + str.slice(1);

export const fileDataMap: FileDataMap = (fileData, params, template) => {
    let {moduleName, fileName} = params;
    if (!moduleName) {
        moduleName = fileName.split(/[\/\-]/g).map(firstCharToUpperCase).join('');
        moduleName = firstCharToLowerCase(moduleName);
    }
    const lowerCaseModuleName = moduleName[0].toLowerCase() + moduleName.slice(1);
    const firstCharUpperCaseModuleName = moduleName[0].toUpperCase() + moduleName.slice(1);
    if (template.templateName.indexOf('.scss') > -1) {
        return fileData.replace(/template/g, fileName.replace(/\//g, '-'));
    }
    return fileData.replace(/Template/g, firstCharUpperCaseModuleName).replace(/template/g, lowerCaseModuleName);
};

export const moduleNameQuestion = {
    question: '请输入模块名字\n',
    paramName: 'moduleName',
    check: (d: string) => {
        const res = /^[a-zA-Z0-9]+$/.test(d);
        if (!res) {
            console.log('请输入字母和数字的组合！\n');
        }
        return res;
    }
};
