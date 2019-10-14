type operation = 
| F of (int * int)
| A of (int * int)
| S of (int * int)
| T of (int * int)

let string_to_operation op =
    match op with
    | F(a, b) -> Printf.printf "F %03d %03d\n" a b
    | A(a, b) -> Printf.printf "A %03d %03d\n" a b
    | S(a, b) -> Printf.printf "S %03d %03d\n" a b
    | T(a, b) -> Printf.printf "T %03d %03d\n" a b 

let string_to_operations op =
    Array.iter string_to_operation op

type applicable = {
    apply: applicable -> applicable;
    string: string;
}

let rec unbound string = 
    { 
        apply =  (fun x -> unbound ("(A " ^ string ^ " " ^ x.string ^ ")"));
        string = string;
    }

let rec execute operations position valuation =
    match Array.get operations position with
    | F (operand1, operand2) -> 
        let variable = Char.escaped (Char.chr operand1) in 
            {
                apply = (fun x -> execute operations operand2 ((operand1, x)::valuation));
                string = ("(F " ^ variable ^ " " ^ (execute operations operand2 (List.remove_assoc operand1 valuation)).string ^ ")");
            }
    | A (operand1, operand2) -> 
        (execute operations operand1 valuation).apply (execute operations operand2 valuation)
    | S (operand1, _) ->
        (try List.assoc operand1 valuation with
            | Not_found -> unbound ("(S " ^ (Char.escaped (Char.chr operand1)) ^ ")"))
    | T (operand1, _) ->
        execute operations operand1 valuation
