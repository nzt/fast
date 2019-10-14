%token <string> SYM
%token LPN RPN
%token EOF
%type <Compiler.expression> toplevel
%start toplevel

%%

toplevel: expression EOF { $1 };

expression:
| LPN SYM SYM RPN { Compiler.Sexp ( $3 ) }
| LPN SYM SYM expression RPN { Compiler.Fexp ( $3, $4 ) }
| LPN SYM expression expression RPN { Compiler.Aexp ( $3, $4 ) }
