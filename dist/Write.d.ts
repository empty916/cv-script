import { Template } from './index';
declare type Params = {
    fileName: string;
};
export declare type FileDataMap<T extends {
    [k: string]: string;
} = any> = (fileData: string, params: T & Params, template: Template) => string;
export default class Write {
    static mkdir(dirPath: string, dirName: string): void;
    static write(filePath: string, template: Template, maps: FileDataMap[], params: Params): void;
}
export {};
