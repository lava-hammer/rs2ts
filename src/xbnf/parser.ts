import { replaceAll } from '../utils';
import { Item, ebnfMeta, Schema, ElemType } from './meta';

interface AST {
  root: SNode;
  errors: string[];
}

interface SNode {
  parent: SNode;
  label: string;
  children: SNode[];
  line?: number;
  column?: number;
}

interface State {
  data: any;
  name: string;
  index: number;
  startPos: number;
}

enum MatchResult {
  ACCEPT,
  REJECT,
  ACCEPT_COMPLETE = 1,
  REJECT_STOP,
}

interface IFnState {
  (state: any, char: string): MatchResult;
}

function escape(str: string): string {
  // todo:
  return str;
}

export class Parser {

  private schema: Schema;
  // private SPITTER: string[];

  loadSchema(schema: Schema) {
    this.schema = schema;
    this.SPITTER = schema['SPITTER'] as string[] || [' ', '\t', '\n'];
  }
  
  private normalizeSource(text: string) {
    text = replaceAll(text, '\r\n', '\n');
    text = replaceAll(text, '\r', '\n');
    return text;
  }
  
  private source: string;
  private errorMsgs: string[] = [];
  private pos: number;
  private line: number;
  private column: number;
  private stateStack: State[] = [];

  private pushState(name: string, pos: number) {
    this.stateStack.push({
      name,
      index: 0,
      startPos: pos,
      data: null,
    });
  }

  private peekState(): State | undefined {
    if (this.stateStack.length > 0) {
      return this.stateStack[0];
    } else {
      return undefined;
    }
  }

  private error(msg: string) {
    this.errorMsgs.push(`${msg} @ ${this.line}:${this.column}`);
  }

  private match(item: Item, data: any, char: string): MatchResult {
    // char = escape(char);
    const items = this.schema[state.name];
    if (state.index <= items.length) {
      const elem = items[state.index];
      if (typeof elem === 'string') {
        switch(elem) {
          case '\\a': {

          } break;
          case '\\d': {

          } break;
          case '\\s': {

          } break;
          case '\\S': {

          } break;
          case '\\w': {

          } break;
          case '\\n': {

          } break;
          case '\\c': {

          } break;
          default: {

          } break;
        }
      } else {
        switch (elem.type) {
          case ElemType.NON_TERMINAL: {

          } break;
          case ElemType.ALTERNATION: {

          } break;
          case ElemType.OPTIONAL: {

          } break;
          case ElemType.REPETITION: {

          } break;
          case ElemType.GROUPING: {

          } break;
        }
      }
    } else {
      // todo:
    }
  }

  parse(source: string): AST {
    // init
    let stop = false;
    this.source = this.normalizeSource(source);
    this.pos = 0;
    this.line = 1;
    this.column = 0;
    this.errorMsgs.length = 0;
    this.stateStack.length = 0;
    this.pushState('ENTRY', 0);

    while (this.pos < this.source.length && (!stop)) {
      const char = this.source[this.pos];
      // pos counter
      this.column++;
      if (char === '\n') {
        this.line++;
        this.column = 1;
      }
      let accepted = false;
      while (!accepted) {
        const state = this.peekState();
        if (state) {
          const it = this.schema[state.name][state.index];

          const result = this.match(it, state.data, char);
          switch(result) {
            case MatchResult.ACCEPT: {
              accepted = true;
            } break;
            case MatchResult.ACCEPT_COMPLETE: {
              accepted = true;
              // commit item
              if (typeof it === 'string') {
                console.log(`COMMIT: ${it}`);
              } else {
                console.log(`COMMIT: ${typeof it.value === 'string' ? it.value : ElemType[it.type]}`);
              }
              state.index++;
              if (state.index >= this.schema[state.name].length) {
                this.stateStack.pop();
              }
            } break;
            case MatchResult.REJECT: {
              this.pos = state.startPos;
              this.stateStack.pop();
              const upperState = this.peekState();
              // upperState.
            } break;
            case MatchResult.REJECT_STOP: {

            } break;
          }
        } else {
          this.error(`expected endof file, got char: ${char}`);
          stop = true;
        }
      }
    }
    return null;
  }
}
