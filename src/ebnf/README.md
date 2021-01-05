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
| digit            | \d        |
| any space        | \s        |
| char, digit, _   | \w        |

| Not supported    |           |
|------------------|-----------|
| terminal string	 | ' ... '   |
| comment          | (* ... *) |
| special sequence | ? ... ?   |
| exception	       | -         |

EBNF see https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form