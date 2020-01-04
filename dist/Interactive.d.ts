export interface Question {
    question: string | any[];
    paramName: string;
    check: (...a: any[]) => boolean;
    type?: 'input' | 'select';
}
/**
 * 交互类
 * 处理用户在控制台的交互
 */
export default class Interactive {
    questions: Question[];
    params: {
        [k: string]: any;
    };
    isComplete: boolean;
    constructor(questions: Question[]);
    start(): void;
    getValue(): {
        [k: string]: any;
    };
}
