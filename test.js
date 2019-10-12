import { evaluate } from "./vm.js";
console.log(evaluate("(app (fun y (app x y)) z)").toString());
console.log(evaluate("(app (app (fun f (app (fun x (app f (app x x))) (fun x (app f (app x x))))) (fun f (fun x (app (fun y x) (app f x))))) y)").toString());
// => (fun x x)
