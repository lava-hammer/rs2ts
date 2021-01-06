## About EBNF

| Usage	           | Notation  |
|------------------|-----------|
| definition       | =         |
| concatenation    | ,         |
| termination	     | ;         |
| alternation	     | \|        |
| optional	       | [ ... ]   |
| repetition	     | { ... }   |
| grouping	       | ( ... )   |
| terminal string	 | " ... "   |

| Extension        |           |
|------------------|-----------|
| alphabet         | \a        |
| digit            | \d        |
| any space        | \s        |
| any non space    | \S        |
| char, digit, _   | \w        |
| line feed        | \n        |
| any char but line feed | \c  |
| Escape "         | \"        |
| Escape \         | \\        |

| Not supported    |           |
|------------------|-----------|
| terminal string	 | ' ... '   |
| comment          | (* ... *) |
| special sequence | ? ... ?   |
| exception	       | -         |

EBNF see https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form