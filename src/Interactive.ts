import {isFunc, isString, isObj, isUndef} from './utils'
import clgStyle from './consoleStyle'
const readlineSync = require('readline-sync');
const path = require('path');


export interface Question {
	question: string | any[];
	paramName: string;
	check: (...a: any[]) => boolean;
	type?: 'input' | 'select';
}

const isQuestionType = (obj: any): obj is Question =>
	isObj(obj)
	&& (isString(obj.question) || Array.isArray(obj.question))
	&& isString(obj.paramName)
	&& isFunc(obj.check)
	&& (isUndef(obj.type) || (obj.type === 'input' || obj.type === 'select'));

/**
 * 交互类
 * 处理用户在控制台的交互
 */
export default class Interactive {
	questions: Question[] = [];
	params: {[k: string]: any} = {};
	isComplete: boolean = false;
	constructor(questions: Question[]) {
		questions.forEach(q => {
			if (isQuestionType(q) === false) {
				throw new Error('question is invalid! question must be like [{question, paramName, check}]');
			}
		});
		this.questions = questions;
	}
	start(): void {
		for (let i = 0; i < this.questions.length; i++) {
			const q = this.questions[i];
			if (isUndef(this.params[q.paramName])) {
				let value = null;
				if (q.type !== 'select') {
					value = readlineSync.question(q.question);
				} else {
					value = readlineSync.keyInSelect(...(q.question as any[]));
				}
				if(q.check(value)) {
					this.params[q.paramName] = value;
					this.isComplete = (i === this.questions.length - 1);
				} else {
					return this.start();
				}
			}
			this.isComplete = (i === this.questions.length - 1);
		}
	}
	getValue() {
		if(!this.isComplete) {
			console.warn(clgStyle.yellow,'用户数据还未采集完成！');
		}
		return this.params;
	}
}

