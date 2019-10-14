let lexbuf = Lexing.from_string "(A (F x (S x)) (S y))" in
let expression = Parser.toplevel Lexer.token lexbuf in
let operations = Compiler.compile expression in
let result = Interpreter.execute operations (Array.length operations - 1) [] in
Printf.printf "%s\n" result.string