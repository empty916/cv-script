# cv-script使用手册

###介绍

1. 这是一个复制粘贴脚本
1. 它可以复制一个文件，并替换文件中你想要替换的字符
1. 他可以复制一个文件夹（只支持单层），并替换文件中你想要替换的字符

### talk is cheap

```node

// 导入包
const CvScript = require('cv-script').default;
const path = require('path');
// 导入常用的工具
const { fileDataMap, moduleNameQuestion } = require('cv-script/dist/utils');

// 模板路径
const templatePath = path.join(__dirname, 'templates');

// 这是文件需要复制到哪里的路径
const distPath = path.join(__dirname, '..', '..', 'src', 'modules');


const cvs = new CvScript({
  questions: [moduleNameQuestion], // 这是你要在控制台收集的问题配置
  templateDirPath: templatePath, // 这是存放文件夹模板的路径
  templateFilePath: templatePath, // 这是存放文件模板的路径
  distPath: distPath, // 这是文件需要复制到哪里的路径
  fileDataMaps: [fileDataMap], // 这是文件内容替换工具函数
});

// 开始执行
cvs.start();

```


### questions: Question[]

```ts

export interface Question {
	question: string | any[]; 
	paramName: string;
	check?: (userInput: string) => boolean;
	type?: 'input' | 'select';
}
```

- Question有两种类型，一种是用户输入的交互，另一种是用户选择的交互，这里用的是三方插件readline-sync
- type为input类型时，question只能是string，默认input
- type是select时候，question必须是以下数据结构

```typescript
// question
[['选项1', '选项2', '选项2'], '请选择'];
```

- paramName是你根据参数名称拿到用户输入或选择的值；这个值在fileDataMaps函数中获取
- check是你检查用户输入的值是否符合要求，不符合会重新询问用户，返回true或false，入参是用户在控制台输入的值


### fileDataMaps: FileDataMap


**在fileDataMap函数中，你会收到模板文件的字符串（fileData），还有用户输入的数据（params）以及模板的信息（template）
你需要返回处理后的文件字符串，供脚本生成文件**

```typescript

type Template = {
    templateName: string,
    templatePath: string,
    data?: string,
}

type Params = {
    fileName: string;
}

type FileDataMap<T extends {[k: string]: string;} = any> = (fileData: string, params: T & Params, template: Template) => string;
```
