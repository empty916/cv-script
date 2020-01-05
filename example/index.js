
const CvScript = require('../dist/index').default;
const Write = require('../dist/Write').default;
const path = require('path');
const { fileDataMap, moduleNameQuestion } = require('../dist/utils');

// 模板地址
const templatePath = '/Users/wangxiaogang/Documents/github/cv-script/templates';

Write.mkdir(path.join(__dirname, '..'), 'tempDist');
Write.mkdir(path.join(__dirname, '..'), 'tempDist2');

const cvs = new CvScript({
    // questions: [],
    templateDirPath: templatePath,
    templateFilePath: templatePath,
    distPath: '/Users/wangxiaogang/Documents/github/cv-script/tempDist',
    fileDataMaps: [fileDataMap],
    // mapWriteFile: (files, params, isCvDir) => {
    //     let finalFiles = [...files];
    //     if (isCvDir) {
    //         return finalFiles.map(f => {
    //             if (f.templateName === 'style.scss') {
    //                 return {
    //                     ...f,
    //                     distPath: f.distPath + '2',
    //                     isCvDir: false,
    //                 }
    //             }
    //             return f;
    //         })
    //     }
    //     return finalFiles;
    // }
    // filterSelectTemplate: templates => templates.filter(t => t.templateName === 'base'),
});

cvs.start();
