import Interactive, {Question} from './Interactive'
import Read from "./Read";
import consoleStyle from "./consoleStyle";

class CvScript {
    readDir: Read;
    interactive: Interactive;
    isCvDirInteractive: Interactive;
    constructor(qs: Question[], templateDir: string) {
        this.isCvDirInteractive = new Interactive([{
            question: [['文件', '文件夹'], '请问您需要拷贝文件还是文件夹？（文件夹只支持单层）'],
            paramName: 'isCvDir',
            check: v => {
                if (v === -1) {
                    console.log(consoleStyle.red, '\n请选择1或者2');
                }
                return v !== -1;
            },
            type: 'select',
        }]);
        this.readDir = new Read(templateDir);
        this.interactive = new Interactive(qs);
    }
    start():void {
        this.isCvDirInteractive.start();
        let tempList: string[] = [];
        if (this.isCvDirInteractive.getValue().isCvDir === 0) {
            tempList = this.readDir.getSubFileNameList();
        } else {
            tempList = this.readDir.getSubDirNameList();
        }

        const selectTempInteractive = new Interactive([{
            question: [tempList, '请选择模板'],
            paramName: 'targetTemp',
            check: v => {
                if (v === -1) {
                    console.log(consoleStyle.red, '\n请选择需要复制的模板');
                }
                return v !== -1;
            },
            type: 'select',
        }]);
        selectTempInteractive.start();
        console.log(selectTempInteractive.getValue())
        // this.interactive.start();
        // const params = this.interactive.getValue();
        // console.log(this.readDir.getSubDirList());
        // console.log(this.readDir.getSubDirNameList());
        // console.log(this.readDir.getSubFileList());
        // console.log(this.readDir.getSubFileNameList());
    }
}


const templatePath = '/Users/wangxiaogang/Documents/github/cv-script/templates';

const cvs = new CvScript([
    {
        question: '请输入文件/文件夹名字\n',
        paramName: 'fileName',
        check: (d: any) => {
            const res = /^[a-z]+$/.test(d);
            if (!res) {
                console.log('请输入纯字母字符！\n');
            }
            return res;
        }
    },
], templatePath);

cvs.start();
// export default CvScript;
