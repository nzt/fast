type expression =
| Fexp of (string * expression)
| Aexp of (expression * expression)
| Sexp of (string)

val compile: expression -> Interpreter.operation array