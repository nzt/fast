import { parse } from "./src/parser";
import { compile, dump, read } from "./src/compiler";
import { run as runBinary } from "./src/vm";
import { run as runString } from "./src/interpreter";

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
const ast = parse(code);
console.time("Interpreter");
console.log(runString(ast).toString());
console.timeEnd("Interpreter");
const binary = compile(ast);
console.time("Compiler");
console.log(runBinary(binary).toString());
console.timeEnd("Compiler");