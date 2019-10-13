type Delayed<A> = A | (() => Delayed<A>)
const lazy = true;
const delay = <A>(thunk: () => Delayed<A>): Delayed<A> => lazy ? thunk : thunk();
const force = <A>(thunk: Delayed<A>): A => thunk instanceof Function ? force(thunk()) : thunk;
const fix = <A, B>(f: (g: (x: A) => B) => (x: A) => B) => (x: A): B => f(fix(f))(x);

export interface Operation {
    index: number;
    opcode: string;
    operand: number[];
}

interface Applicable {
	apply: (x: Delayed<Applicable>) => Delayed<Applicable>;
	toString: () => string;
}
type Valuation = {[k: string]: Delayed<Applicable>}

const execute = (op: Operation[], pos: number) => (val: Valuation): Delayed<Applicable>  => ({
    T: () => execute(op, op[pos].operand[0])(val),
    F: () => delay<Applicable>(()=>({
        apply: (x: Delayed<Applicable>) => execute(op, op[pos].operand[0])({ ...val, [op[pos].operand[1]]: x }),
        toString: () => `(F ${String.fromCharCode(op[pos].operand[1])} ${force(execute(op, op[pos].operand[0])({ ...val, [op[pos].operand[1]]: undefined }))})`
    })),
    S: () => val[op[pos].operand[0]] || fix((c: (s: string) => Applicable) => (s: string): Applicable => ({
        apply: (x: Delayed<Applicable>) => c(`(A ${s} ${force(x).toString()})`),
        toString: () => s
    }))(`(S ${String.fromCharCode(op[pos].operand[0])})`),
    A: () => delay(() => force(execute(op, op[pos].operand[0])(val)).apply(execute(op,op[pos].operand[1])(val))),
}[op[pos].opcode])();

export const run = (op: Operation[]) => force(execute(op, op.findIndex(({opcode})=>opcode=="T"))({}));