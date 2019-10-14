type operation = 
| Fop of (int * int)
| Aop of (int * int)
| Sop of (int * int)
| Top of (int * int)

type applicable = {
    apply: applicable -> applicable;
    string: string;
}

val execute: operation array -> int -> (int * applicable) list -> applicable