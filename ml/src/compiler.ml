type expression =
| Fexp of (string * expression)
| Aexp of (expression * expression)
| Sexp of (string)

let rec generate s i =
    match s with
    | Fexp (operand1, operand2) -> 
        let (j, t) = generate operand2 i in
            (j + 1, t @ [Inpterpreter.Fop(Char.code operand1.[0], j - 1)])
    | Aexp (operand1, operand2) ->
        let (j, t) = generate operand1 i in
        let (k, u) = generate operand2 j in
            (k + 1, t @ u @ [Inpterpreter.Aop(j - 1, k - 1)])
    | Sexp (operand1) ->
        (i + 1, [Inpterpreter.Sop(Char.code operand1.[0], 0)])

let compile s =
    let (i, t) = generate s 0 in
        Array.of_list (t @ [Inpterpreter.Top(i, 0)])