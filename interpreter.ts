import Parsimmon from "parsimmon";
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

export const F = (a: string) => (b: Expression) => (v: Valuation) => 
	({
		apply: (x: Delayed<Applicable>) => b({...v, [a]: x}),
		toString: () => `(F ${a} ${force(b({...v, [a]: undefined})).toString()})`
	});
export const S = (a: string) => (v: Valuation) =>
	v[a] || fix<string, Applicable>((c) => (s: string) => ({
		apply: (x: Delayed<Applicable>) => c(`(A ${s} ${x.toString()})`),
		toString: () => s
	}))(`(S ${a})`);
export const A = (a: Expression) => (b: Expression) => (v: Valuation) =>
	delay(() => force(a(v)).apply(b(v)));

const language = Parsimmon.createLanguage({
    Symbol: () => Parsimmon.seqObj<{symbol: string}>(
		Parsimmon.string("("),
		Parsimmon.optWhitespace,
		Parsimmon.string("S"),
		Parsimmon.optWhitespace,
		["symbol", Parsimmon.regexp(/[a-zA-Z]/)],
		Parsimmon.optWhitespace,
		Parsimmon.string(")")
	).map(({ symbol }) => S(symbol)),
    Function: (r) => Parsimmon.seqObj<{argument: string, body: Expression}>(
		Parsimmon.string("("),
		Parsimmon.optWhitespace,
		Parsimmon.string("F"),
		Parsimmon.optWhitespace,
		["argument", Parsimmon.regexp(/[a-z]+/)],
		Parsimmon.optWhitespace,
		["body", Parsimmon.alt(r.Symbol, r.Function, r.Application)],
		Parsimmon.optWhitespace,
		Parsimmon.string(")")
    ).map((m) => F(m.argument)(m.body)),
    Application: (r) => Parsimmon.seqObj<{[k:string]: Expression}>(
		Parsimmon.string("("),
		Parsimmon.optWhitespace,
		Parsimmon.string("A"),
		Parsimmon.optWhitespace,
		["first", Parsimmon.alt(r.Symbol, r.Function, r.Application)],
		Parsimmon.optWhitespace,
		["second", Parsimmon.alt(r.Symbol, r.Function, r.Application)],
		Parsimmon.optWhitespace,
		Parsimmon.string(")")
    ).map((m) => A(m.first)(m.second)),
    Toplevel: (r) => Parsimmon.alt(
		r.Symbol,
		r.Function,
		r.Application
    ).trim(Parsimmon.optWhitespace)
});

export const run = (str: string) => force<Applicable>(language.Toplevel.tryParse(str)({}));