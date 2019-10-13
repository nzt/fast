{
    open Parser
}
rule token = parse
| ['\n' '\r' '\t' ' '] { token lexbuf }
| ['a'-'z']+ as lexeme{ SYM (lexeme) }
| "(" { LPN }
| ")" { RPN }
| eof { EOF } 