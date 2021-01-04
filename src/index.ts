import fs from 'fs';
import { tokenize, untokenize } from './tokenize';

function main() {
  // const src = fs.readFileSync('test.rs', {
  const src = fs.readFileSync('message_meta_db.rs', {
    encoding: 'utf-8'
  });
  const tokens = tokenize(src);
  const rsrc = untokenize(tokens);
  fs.writeFileSync('output.rs', rsrc, {
    encoding: 'utf-8',
  });
}

main();
