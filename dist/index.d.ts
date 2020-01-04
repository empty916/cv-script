import Interaction, { Question } from './Interaction';
import Read from "./Read";
import { FileDataMap } from "./Write";
export { FileDataMap } from './Write';
export { Question } from './Interaction';
export declare type CvScriptConstructor = ({
    templateDirPath: string;
    templateFilePath?: string;
} | {
    templateDirPath?: string;
    templateFilePath: string;
}) & {
    questions: Question[];
    distPath: string;
    fileDataMaps?: FileDataMap[];
};
export declare type Template = {
    templateName: string;
    templatePath: string;
    data?: string;
};
export default class CvScript {
    readDir: Read | undefined;
    readFile: Read | undefined;
    customInteraction: Interaction;
    isCvDir: boolean;
    isCvDirInteraction: Interaction | undefined;
    distPath: string;
    fileDataMaps: FileDataMap[];
    constructor({ questions, distPath, templateDirPath, templateFilePath, fileDataMaps, }: CvScriptConstructor);
    start(): void;
    startToGetTemp(): Template;
    startRead(template: Template): Template[];
    startWrite(templates: Template[]): void;
    getTemplatePath(template: Template): Template[];
}
