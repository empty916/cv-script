export default class Read {
    dir: string;
    constructor(templateDir: string);
    static IsExist(dir: string): boolean;
    isExist(dir: string): boolean;
    private getSubList;
    getSubDirList(p?: string): string[];
    getSubDirNameList(p?: string): string[];
    getSubFileList(p?: string): string[];
    getSubFileNameList(p?: string): string[];
    static GetFileData(p: string): string;
    getFileData(p: string): string;
}
