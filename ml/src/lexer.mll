rule token = parse
| ['\n' '\r' '\t' ' '] { token lexbuf }
| ['a'-'z' 'A'-'Z']+ as lexeme { Parser.SYM (lexeme) }
| "(" { Parser.LPN }
| ")" { Parser.RPN }
| eof { Parser.EOF } 