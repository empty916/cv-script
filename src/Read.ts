import {Dirent} from "fs";

const fs = require('fs');
const glob = require('glob');
const path = require('path');

export default class Read {
    dir: string;
    constructor(templateDir: string) {
        const templateFileIsExist = this.isExist(templateDir);
        if (!templateFileIsExist) {
            throw new Error(`模板目录：${templateDir}不存在!`);
        }
        this.dir = templateDir;
    }
    static IsExist(dir: string): boolean {
        return fs.existsSync(dir)
    }
    isExist(dir: string): boolean {
        return fs.existsSync(dir)
    }
    private getSubList(p: string = this.dir): Dirent[] {
        return fs.readdirSync(p, {withFileTypes: true});
    }
    getSubDirList(p: string = this.dir): string[] {
        return this.getSubList(p)
            .filter((i: Dirent) => i.isDirectory())
            .map((i: Dirent) => path.join(this.dir, i.name));
    }
    getSubDirNameList(p: string = this.dir): string[] {
        return this.getSubList(p)
            .filter((i: Dirent) => i.isDirectory())
            .map((i: Dirent) => i.name);
    }
    getSubFileList(p: string = this.dir): string[] {
        return this.getSubList(p)
            .filter((i: Dirent) => !i.isDirectory())
            .map((i: Dirent) => path.join(this.dir, i.name));
    }
    getSubFileNameList(p: string = this.dir): string[] {
        return this.getSubList(p)
            .filter((i: Dirent) => !i.isDirectory())
            .map((i: Dirent) => i.name);
    }
    static GetFileData(p: string): string {
        return fs.readFileSync(p, {encoding: 'utf-8'});
    }
    getFileData(p: string): string {
        if (!this.isExist(p)) {
            throw new Error(`文件${p}不存在!`);
        }
        return fs.readFileSync(p, {encoding: 'utf-8'});
    }
}
