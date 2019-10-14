type operation = 
| F of (int * int)
| A of (int * int)
| S of (int * int)
| T of (int * int)

type applicable = {
    apply: applicable -> applicable;
    string: string;
}

val execute: operation array -> int -> (int * applicable) list -> applicable