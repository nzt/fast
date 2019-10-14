import { parse } from "./parser";

type Delayed<A> = A | (() => Delayed<A>)
const lazy = true;
const delay = <A>(thunk: () => A) => lazy ? thunk : thunk();
const force = <A>(thunk: Delayed<A>): A => thunk instanceof Function ? force(thunk()) : thunk;
const fix = <A, B>(f: (g: (x: A) => B) => (x: A) => B) => (x: A): B => f(fix(f))(x);

interface Applicable {
	apply: (x: Delayed<Applicable>) => Delayed<Applicable>;
	toString: () => string;
}
type Valuation = {[k: string]: Delayed<Applicable>}
type Expression = (v: Valuation) => Valuation[keyof Valuation];

const F = (a: string) => (b: Expression) => (v: Valuation) => 
	({
		apply: (x: Delayed<Applicable>) => b({...v, [a]: x}),
		toString: () => `(F ${a} ${force(b({...v, [a]: undefined})).toString()})`
	});

const S = (a: string) => (v: Valuation) =>
	v[a] || fix<string, Applicable>((c) => (s: string) => ({
		apply: (x: Delayed<Applicable>) => c(`(A ${s} ${x.toString()})`),
		toString: () => s
	}))(`(S ${a})`);

const A = (a: Expression) => (b: Expression) => (v: Valuation) =>
	delay(() => force(a(v)).apply(b(v)));

const evaluate = (s: ReturnType<typeof parse>): Expression => {
	switch(s[0]) {
		case "F": {
			return F(s[1])(evaluate(s[2]))
		}
		case "A": {
			return A(evaluate(s[1]))(evaluate(s[2]))
		}
		case "S": {
			return S(s[1])
		}
	}
}

export const run = (s: ReturnType<typeof parse>) => force<Applicable>(evaluate(s)({}));