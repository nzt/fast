type expression =
| SymbolExp of string
| ListExp of expression list

val cps_transform: expression -> expression
val compile: expression -> Interpreter.operation array