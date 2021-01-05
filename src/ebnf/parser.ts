import { replaceAll } from '../utils';
import { IBNFNode, ebnfMeta } from './meta';

export class EBNFParser {

  private metaSchema: IBNFNode;

  constructor() {
    this.metaSchema = ebnfMeta;
  }

  private schema: IBNFNode;

  loadSchema(schema: string) {
    // text

  }
  
  private normalizeSource(text: string) {
    text = replaceAll(text, '\r\n', '\n');
    text = replaceAll(text, '\r', '\n');
    return text;
  }
  
  private source: string;
  private line: number;
  private column: number;
  private stateStack = [];

  parse(source: string): IBNFNode {
    // init
    this.source = this.normalizeSource(source);
    this.line = 1;
    this.column = 0;
    this.stateStack.length = 0;

    for (let i=0; i<this.source.length; ++i) {
      const char = this.source[i];
    }
  }

}

enum StateAck {
  ACCEPT = 1,
  ACCEPT_FINISH,
  REJECT_FINISH,
  REJECT_FAILED,
}

interface FnStateResult {
  ack: StateAck,
  value?: string;
}

interface IFnState {
  (state: State, char: string): FnStateResult;
}
