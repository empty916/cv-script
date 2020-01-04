
const CvScript = require('../dist/index').default;
const { fileDataMap, moduleNameQuestion } = require('../dist/utils');

// 模板地址
const templatePath = '/Users/wangxiaogang/Documents/github/cv-script/templates';


const cvs = new CvScript({
    questions: [moduleNameQuestion],
    templateDirPath: templatePath,
    templateFilePath: templatePath,
    distPath: '/Users/wangxiaogang/Documents/github/cv-script/tempDist',
    fileDataMaps: [fileDataMap],
});

cvs.start();
