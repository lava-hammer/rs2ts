
import { KEYWORDS, SYMBOLS, IToken, TokenType } from './const';
import { replaceAll } from './utils';

interface IFragment {
  text: string;
  line: number;
  column: number;
}

function splitLines(src: string): IFragment[] {
  src = replaceAll(src, '\r\n', '\n');
  src = replaceAll(src, '\r', '\n');
  const frags: IFragment[] = [];
  const lines = src.split('\n');
  for (let i=0; i<lines.length; ++i) {
    const ln = lines[i];
    frags.push({
      text: ln,
      line: i+1,
      column: 1,
    });
  }
  return frags;
}

function splitFragment(frag: IFragment, index: number, length: number): IFragment[] {
  if (index === 0 && length === frag.text.length) {
    return [];
  }
  const ret: IFragment[] = [];
  if (index > 0) {
    ret.push({
      text: frag.text.substring(0, index),
      line: frag.line,
      column: frag.column,
    });
  }
  if (index + length < frag.text.length) {
    ret.push({
      text: frag.text.substring(index + length),
      line: frag.line,
      column: frag.column + index + length,
    });
  }
  return ret;
}

function sortList(list: (IFragment|IToken)[]) {
  list.sort((a, b) => {
    if (a.line !== b.line) {
      return a.line - b.line;
    }
    return a.column - b.column;
  });
}

function scanMatched(tokens: IToken[], frags: IFragment[], re: RegExp, tt?: TokenType, fn?: (txt: string) => string) {
  for (let i = 0; i < frags.length; ++i) {
    let fg = frags[i];
    let match = fg.text.match(re);
    if (match) {
      const matchStr = match[1];
      const idxm = fg.text.indexOf(matchStr, match.index);
      if (tt) {
        tokens.push({
          type: tt,
          text: fn ? fn(matchStr) : matchStr,
          line: fg.line,
          column: fg.column + idxm,
        });
      }
      frags.splice(i, 1, ...splitFragment(fg, idxm, matchStr.length));
      i--;
    }
  }
}

function scanSubstring(tokens: IToken[], frags: IFragment[], sub: string, tt?: TokenType) {
  for (let i = 0; i < frags.length; ++i) {
    let fg = frags[i];
    const idx = fg.text.indexOf(sub);
    if (idx >= 0) {
      if (tt) {
        tokens.push({
          type: tt,
          text: sub,
          line: fg.line,
          column: fg.column + idx,
        });
      }
      frags.splice(i, 1, ...splitFragment(fg, idx, sub.length));
      i--;
    }
  }
}

function printTokens(tokens: IToken[]) {
  for (let t of tokens) {
    console.log(`[ ${t.text} ] as ${TokenType[t.type]} @ ${t.line}:${t.column}`);
  }
  console.log(`## END OF TOKENS, TOTAL=${tokens.length}`);
}

function processComments(tokens: IToken[], frags: IFragment[]) {
  for (let i=0; i<frags.length; ++i) {
    let fg = frags[i];
    const idx = fg.text.indexOf('//');
    if (idx >= 0) {
      tokens.push({
        type: TokenType.COMMENT,
        text: fg.text.substring(idx+2),
        line: fg.line,
        column: fg.column + idx + 2,
      });
      frags.splice(i, 1, ...splitFragment(fg, idx, fg.text.length - idx));
    }
  }
}

function processStrings(tokens: IToken[], frags: IFragment[]) {
  const reNextlineEnd = /\\\s*/;
  const reNextFull = /\s*(.*)\\\s*/;
  const reStrEnd = /^\s*(.*)"/;
  for (let i = 0; i < frags.length; ++i) {
    const fg = frags[i];
    let idx1 = fg.text.indexOf('"');
    if (idx1 >= 0) {
      let idx2 = fg.text.indexOf('"', idx1+1);
      if (idx2 >= 0) {
        tokens.push({
          type: TokenType.STRING,
          text: fg.text.substring(idx1+1, idx2),
          line: fg.line,
          column: fg.column + idx1 + 1,
        });
        frags.splice(i, 1, ...splitFragment(fg, idx1, idx2 - idx1 + 1));
        i--; // continue scan new splitted fragments
      } else {
        // multi-line string
        const idx3 = fg.text.search(reNextlineEnd);
        if ( idx3 >= 0) {
          let strBuffer = fg.text.substring(idx1+1, idx3);
          const newFrags = splitFragment(fg, idx1, fg.text.length - idx1);
          frags.splice(i, 1, ...newFrags);
          for (let j=i + newFrags.length; j<frags.length; ++j) {
            const nfg = frags[j];
            const idxs = nfg.text.search(reStrEnd);
            if (idxs >= 0) {
              const matchStr = nfg.text.match(reStrEnd);
              console.assert(matchStr.length === 2, 'wrong str match');
              strBuffer += matchStr[1];
              tokens.push({
                type: TokenType.STRING,
                text: strBuffer,
                line: fg.line,
                column: fg.column + idx1 + 1,
              });
              const nFrags = splitFragment(nfg, 0, nfg.text.indexOf('"')+1);
              frags.splice(j, 1, ...nFrags);
              i--; // continue scan new splitted fragments
              break;
            } else {
              const idxn = nfg.text.search(reNextFull);
              if (idxn >= 0) {
                const matchStr = nfg.text.match(reNextFull);
                console.assert(matchStr.length === 2, 'wrong str match');
                strBuffer += matchStr[1];
                frags.splice(j, 1);
                i--;
                j--;
              } else {
                throw new Error(`expected "\\" at the end of line @ ${nfg.line}:${nfg.column + nfg.text.length - 1}`);
              }
            }
          }
        } else {
          throw new Error(`broken string literal @ ${fg.line}:${fg.column}`);
        }
      }
    }
  }
  // process char
  scanMatched(tokens, frags, /('.')/, TokenType.CHAR, str=>str[1]);
}

function processU8(tokens: IToken[], frags: IFragment[]) {
  // u8
  scanMatched(
    tokens,
    frags,
    /\W(b'.')\W/,
    TokenType.NUMBER
  );
}

function processNumbers(tokens: IToken[], frags: IFragment[]) {
  // integer & float
  scanMatched(
    tokens,
    frags,
    /(?<=^|\W)(\d[\d._]*)(?=\W|$)/,
    TokenType.NUMBER
  );
  // 0x/0o/0b
  scanMatched(
    tokens,
    frags,
    /(?<=^|\W)(0[xob][a-fA-F\d_]+)(?=\W|$)/,
    TokenType.NUMBER
  );
}

function splitSpaces(tokens: IToken[], frags: IFragment[]) {
  scanMatched(
    tokens,
    frags,
    /(\s)/
  );
}

function processSymbols(tokens: IToken[], frags: IFragment[]) {
  for (let sym of SYMBOLS) {
    scanSubstring(
      tokens,
      frags,
      sym,
      TokenType.SYMBOL
    );
  }
}

function processKeywordsAndNames(tokens: IToken[], frags: IFragment[]) {
  for (let fg of frags) {
    if (fg.text.length > 0) {
      tokens.push({
        type: KEYWORDS.includes(fg.text) ? TokenType.KEYWORD : TokenType.NAME,
        text: fg.text,
        line: fg.line,
        column: fg.column,
      });
    }
  }
}

function token2str(token: IToken): string {
  if (token.type == TokenType.COMMENT) {
    return `//${token.text}`;
  }
  if (token.type == TokenType.STRING) {
    return `"${token.text}"`;
  }
  if (token.type == TokenType.CHAR) {
    return `'${token.text}'`;
  }
  return token.text;
}

export function untokenize(tokens: IToken[]): string {
  const lines: IToken[][] = [];
  for (let tk of tokens) {
    if (lines[tk.line-1] == null) {
      lines[tk.line-1] = [];
    }
    lines[tk.line-1].push(tk);
  }
  for (let ln of lines) {
    if (ln) {
      sortList(ln);
    }
  }
  let lnstr: string[] = [];
  for (let ln of lines) {
    if (ln) {
      lnstr.push(ln.map(token2str).join(' '));
    } else {
      lnstr.push('');
    }
  }
  return lnstr.join('\n');
}

export function tokenize(src: string): IToken[] {
  const tokens: IToken[] = [];
  const frags = splitLines(src);
  processComments(tokens, frags);
  processU8(tokens, frags);
  processStrings(tokens, frags);
  processNumbers(tokens, frags);
  splitSpaces(tokens, frags);
  processSymbols(tokens, frags);
  processKeywordsAndNames(tokens, frags);
  sortList(tokens);
  return tokens;
}