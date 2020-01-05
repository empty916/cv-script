import { FileDataMap } from "./Write";
export declare const isObj: (value: any) => value is Object;
export declare const isUndef: (value: any) => value is undefined;
export declare const isString: (value: any) => value is string;
export declare const isRegExp: (value: any) => value is RegExp;
export declare const isFunc: (value: any) => value is Function;
export declare const firstCharToUpperCase: (str: string) => string;
export declare const firstCharToLowerCase: (str: string) => string;
export declare const fileDataMap: FileDataMap;
export declare const moduleNameQuestion: {
    question: string;
    paramName: string;
    check: (d: string) => boolean;
};
