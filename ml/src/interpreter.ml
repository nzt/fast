type operation = 
| Fop of (int * int)
| Aop of (int * int)
| Sop of (int * int)
| Top of (int * int)

type applicable = {
    apply: applicable -> applicable;
    string: string;
}

let rec execute operations position valuation =
    match Array.get operations position with
    | Fop (operand1, operand2) -> {
            apply = (fun x -> execute operations operand2 ((operand1, x)::valuation));
            string = ("(F " ^ Char.escaped (Char.chr operand1) ^ " " ^ (execute operations operand2 (List.remove_assoc operand1 valuation)).string ^ ")");
        }
    | Aop (operand1, operand2) -> 
        (execute operations operand1 valuation).apply (execute operations operand2 valuation)
    | Sop (operand1, _) ->
        let rec unbound string = { apply =  (fun x -> unbound ("(A " ^ string ^ " " ^ x.string ^ ")")); string = string; } in
            (try List.assoc operand1 valuation with Not_found -> unbound (Char.escaped (Char.chr operand1)))
    | Top (operand1, _) ->
        execute operations operand1 valuation
