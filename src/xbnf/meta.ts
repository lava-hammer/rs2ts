
export enum ElemType {
  NON_TERMINAL = 1,
  ALTERNATION,
  OPTIONAL,
  REPETITION,
  GROUPING,
}

interface IElem {
  type: ElemType,
  value: Item[] | string,
}

export type Item = string | IElem;

function NT(label: string) {
  return {
    type: ElemType.NON_TERMINAL,
    value: label,
  };
}

function AL(...item: Item[]): IElem {
  return {
    type: ElemType.ALTERNATION,
    value: [...item],
  };
}

function OP(...item: Item[]): IElem {
  return {
    type: ElemType.OPTIONAL,
    value: [...item],
  };
}

function RE(...item: Item[]): IElem {
  return {
    type: ElemType.REPETITION,
    value: [...item],
  };
}

function GR(...item: Item[]): IElem {
  return {
    type: ElemType.GROUPING,
    value: [...item],
  };
}

export type Schema = {[key: string]: Item[]};

export const ebnfMeta: Schema = {
  SPITTER: [' ', '\t', '\n'],
  ENTRY: [ RE( AL(NT('rule'), NT('comment'))) ],
  comment: ['//', RE('\\c')],
  rule: [NT('nterm'), '=', NT('list'), ';', OP('comment')],
  nterm: ['\\a', RE('\\w')],
  list: [AL(NT('item'), GR(RE(NT('item'), ','), NT('item')))],
  item: [AL(NT('nterm'), NT('term'), NT('group'), NT('alter'), NT('option'), NT('repet'))],
  term: ['\"', '\\S', RE('\\S'), '\"'],
  group: ["(", NT('list'), ")"],
  alter: [NT('item'), '|', NT('item')],
  option: ['[', NT('list'), ']'],
  repeat: ['{', NT('list'), '}'],
}