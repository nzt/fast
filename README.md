# Lize

Lize is an experimental programming language for the experiment of lambda calculus.

## FAST IR

FAST IR is an internal representation of FAST VM designed for human readability.

| Expression                      | Description                                                                                             |
| :------------------------------ | :------------------------------------------------------------------------------------------------------ |
| `(F <symbol> <expression>)`     | Return function which binds given argument to the symbol and evaluate the expression.                   |
| `(A <expression> <expression>)` | Apply the second expression as an argument to the first expression                                      |
| `(S <symbol>)`                  | Refer the symbol from the current stack.                                                                |
| `(T <expression>)`              | Not available but it is able to see that the interpreter and compiler will wrap the expression by this. |

## FAST VM

FAST VM is a bytecode interpreter of Lize.

| Operation Code | Operand 1                    | Operand 2                      | Description                                                          |
| :------------- | :--------------------------- | :----------------------------- | :------------------------------------------------------------------- |
| F              | Parameter name               | Position of next operation     | Bind given argument to the parameter and move to the next operation. |
| A              | Position of callee operation | Position of argument operation | Apply the second operation as an argument to the first operation     |
| S              | Symbol name                  |                                | Refer the symbol from the current stack.                             |
| T              | Position of next operation   |                                | Declare where the entrypoint is.                                     |
