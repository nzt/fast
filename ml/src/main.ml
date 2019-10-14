let lexbuf = Lexing.from_string "(A (F x (S x)) (S y))" in
let expression = Parser.toplevel Lexer.token lexbuf in
let operations = Compiler.compile expression in
let print_op op =
    match op with
    | Interpreter.Fop(a, b) -> Printf.printf "F %03d %03d\n" a b
    | Interpreter.Aop(a, b) -> Printf.printf "A %03d %03d\n" a b
    | Interpreter.Sop(a, b) -> Printf.printf "S %03d %03d\n" a b
    | Interpreter.Top(a, b) -> Printf.printf "T %03d %03d\n" a b in
Array.iter print_op operations;
let result = Interpreter.execute operations (Array.length operations - 1) [] in
Printf.printf "%s\n" result.string