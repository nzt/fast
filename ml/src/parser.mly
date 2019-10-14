%token <string> SYM
%token LPN RPN
%token EOF
%type <Compiler.expression> toplevel
%start toplevel

%%

toplevel: expression EOF { $1 };

list:
| expression list { $1 :: $2 }
| RPN { [ ] }

expression:
| SYM { Compiler.SymbolExp $1 }
| LPN list { Compiler.ListExp $2 }
