%token <string> SYM
%token LPN RPN
%token EOF
%type <expression> toplevel
%start toplevel

%%

toplevel: expression EOF { $1 };

expression:
| LPN SYM SYM RPN { Sexp ( $3 ) }
| LPN SYM SYM expression RPN { Fexp ( $3, $4 ) }
| LPN SYM expression expression RPN { Aexp ( $3, $4 ) }
