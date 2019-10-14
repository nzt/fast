type expression =
| SymbolExp of string
| ListExp of expression list

val compile: expression -> Interpreter.operation array