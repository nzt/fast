type expression =
| Fexp of (string * expression)
| Aexp of (expression * expression)
| Sexp of (string)

let rec generate s i =
    match s with
    | Fexp (operand1, operand2) -> 
        let (j, t) = generate operand2 (i + 1) in
            (j + 1, t @ [Inpterpreter.Fop(Char.code operand1.[0], j)])
    | Aexp (operand1, operand2) ->
        let (j, t) = generate operand1 (i + 1) in
        let (k, u) = generate operand2 (j + 1) in
            (k + 1, t @ u @ [Inpterpreter.Aop(j, k)])
    | Sexp (operand1) ->
        let t = Char.code operand1.[0] in
            (i + 1, [Inpterpreter.Sop(t, 0)])

let compile s =
    let (i, t) = generate s 0 in
        Array.of_list (t @ [Inpterpreter.Top(i, 0)])