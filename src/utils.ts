

export const isObj = (value: any): value is Object => typeof value === 'object' && value !== null;

export const isUndef = (value: any): value is undefined => value === undefined;

export const isString = (value: any): value is string => typeof value === 'string';

export const isRegExp = (value: any): value is RegExp => value instanceof RegExp;

export const isFunc = (value: any): value is Function => typeof value === 'function';
