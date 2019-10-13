type operation = 
| Fop of (int * int)
| Aop of (int * int)
| Sop of (int * int)
| Top of (int * int)

type expression =
| Fexp of (string * string * expression)
| Aexp of (string * expression * expression)
| Sexp of (string * string)

let rec generate s i =
    match s with
    | Fexp (opecode, operand1, operand2) -> 
        let (j, t) = generate operand2 (i + 1) in
            (j + 1, t @ [Fop(Char.code operand1.[0], j)])
    | Aexp (opecode, operand1, operand2) ->
        let (j, t) = generate operand1 (i + 1) in
        let (k, u) = generate operand2 (j + 1) in
            (k + 1, t @ u @ [Aop(j, k)])
    | Sexp (opecode, operand1) ->
        let t = Char.code operand1.[0] in
            (i + 1, [Sop(t, 0)])

let compile s =
    let (i, t) = generate s 0 in
        Array.of_list (t @ [Top(i, 0)])