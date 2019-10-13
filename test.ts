import { compile, dump, read } from "./compiler";
import { run as runCompiled } from "./vm";
import { run as runString } from "./interpreter";

let code = `
    (A
        (F
            f
            (A
                (F
                    x
                    (A
                        (S f)
                        (A (S x) (S x))
                    )
                )
                (F
                    x
                    (A
                        (S f)
                        (A (S x) (S x))
                    )
                )
            )
        )
        (F y (S z))
    )`
console.log(runString(code).toString());
//console.log(run(read(dump(compile(code)))).toString());
