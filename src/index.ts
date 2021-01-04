import fs from 'fs';
import { tokenize, untokenize } from './tokenize';

function main() {
  const src = fs.readFileSync('test/test.rs', {
    encoding: 'utf-8'
  });
  const tokens = tokenize(src);
  const rsrc = untokenize(tokens);
  fs.writeFileSync('test/out.rs', rsrc, {
    encoding: 'utf-8',
  });
}

main();
