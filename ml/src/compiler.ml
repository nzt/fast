open Interpreter

exception Invalid_operation of string

type expression =
| SymbolExp of string
| ListExp of expression list

let rec expression_to_string ex =
    match ex with
    | ListExp l -> "(" ^ (String.concat " " (List.map expression_to_string l)) ^ ")"
    | SymbolExp s -> s

let rec generate s i =
    match s with
    | ListExp [SymbolExp "F"; SymbolExp operand1; ListExp operand2] ->
        let (j, t) = generate (ListExp operand2) i in
            (j + 1, t @ [F(Char.code operand1.[0], j - 1)])
    | ListExp [SymbolExp "A"; ListExp operand1; ListExp operand2] ->
        let (j, t) = generate (ListExp operand1) i in
        let (k, u) = generate (ListExp operand2) j in
            (k + 1, t @ u @ [A(j - 1, k - 1)])
    | ListExp [SymbolExp "S"; SymbolExp operand1] ->
        (i + 1, [S(Char.code operand1.[0], 0)])
    | _ -> raise (Invalid_operation (expression_to_string s))

let compile s =
    let (i, t) = generate s 0 in
        Array.of_list (t @ [T(i - 1, 0)])
