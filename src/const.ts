
export const KEYWORDS = [
  'as',
  'break',
  'const',
  'continue',
  'crate',
  'else',
  'enum',
  'extern',
  'false',
  'fn',
  'for',
  'if',
  'impl',
  'in',
  'let',
  'loop',
  'match',
  'mod',
  'move',
  'mut',
  'pub',
  'ref',
  'return',
  'self',
  'Self',
  'static',
  'struct',
  'super',
  'trait',
  'true',
  'type',
  'unsafe',
  'use',
  'where',
  'while',
  'async',
  'await',
  'dyn',
  'abstract',
  'become',
  'box',
  'do',
  'final',
  'macro',
  'override',
  'priv',
  'typeof',
  'unsized',
  'virtual',
  'yield',
  'try',
  'union',
  "'static",
];

export const SYMBOLS = [
  '::',
  '=>',
  '==',
  '//',
  '&&', '||',
  '{', '}',
  '[', ']',
  '(', ')',
  '<', '>',
  ',', '.', '!', '?', ';', ':', '&', '#',
  '+', '-', '*', '/', '=', '%',
  '|'
];

export enum TokenType {
  KEYWORD = 1,
  SYMBOL,
  NAME,
  STRING,
  CHAR,
  COMMENT,
  NUMBER,
}

export interface IToken {
  type: TokenType;
  text: string;
  line: number;
  column: number;
}

export interface SynNode {
  key: string;
  attrs: {[key: string]: any};
  parent: SynNode;
  children: SynNode[];
}

export interface AST {
  root: SynNode;
}