import Interaction, { Question } from './Interaction';
import Read from "./Read";
import { FileDataMap, Params } from "./Write";
export { FileDataMap } from './Write';
export { Question } from './Interaction';
export declare type FilterSelectTemplate = (template: Template[]) => Template[];
export declare type MapWriteFile = (files: WriteFile[], params: Params & {
    [k: string]: string;
}, isCvDir: boolean) => WriteFile[];
export declare type CvScriptConstructor = ({
    templateDirPath: string;
    templateFilePath?: string;
} | {
    templateDirPath?: string;
    templateFilePath: string;
}) & {
    questions?: Question[];
    distPath: string;
    fileDataMaps?: FileDataMap[];
    filterSelectTemplate?: FilterSelectTemplate;
    mapWriteFile?: MapWriteFile;
};
export declare type Template = {
    templateName: string;
    templatePath: string;
    data?: string;
    distPath?: string;
    fileName?: string;
    isCvDir?: boolean;
};
export declare type WriteFile = Required<Template>;
export default class CvScript {
    readDir: Read | undefined;
    readFile: Read | undefined;
    customInteraction: Interaction;
    isCvDir: boolean;
    isCvDirInteraction: Interaction | undefined;
    distPath: string;
    fileDataMaps: FileDataMap[];
    filterSelectTemplate: FilterSelectTemplate | undefined;
    mapWriteFile: MapWriteFile | undefined;
    constructor({ questions, distPath, templateDirPath, templateFilePath, fileDataMaps, filterSelectTemplate, mapWriteFile, }: CvScriptConstructor);
    start(): void;
    startToGetTemp(): Template;
    startRead(template: Template): (Template & {
        data: string;
    })[];
    startWrite(templates: (Template & {
        data: string;
    })[]): void;
    getTemplatePath(template: Template): Template[];
}
