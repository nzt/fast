import Parsimmon from "parsimmon";

const lazy = true;
const delay = (thunk) => lazy ? thunk : thunk();
const force = (thunk) => typeof thunk === "function" ? force(thunk()) : thunk;
const fix = (f) => ((x) => f((y) => x(x)(y)))((x) => f((y) => x(x)(y)));

const fun = (a) => (b) => (v) => ({
    apply: (x) => delay(() => b({...v, [a]: x})),
    toString: () => `(fun ${a} ${force(b({...v, [a]: undefined})).toString()})`
});
const sym = (a) => (v) => v[a] || fix((c) => (s) => ({
    apply: (x) => delay(()=>c(`(app ${s} ${x.toString()})`)),
    toString: () => s
}))(a);
const app = (a) => (b) => (v) => (a(v)).apply(b(v));

const language = Parsimmon.createLanguage({
    Symbol: () => Parsimmon.regexp(/[a-z]+/).map(sym),
    Function: (r) => Parsimmon.seqObj(
	Parsimmon.string("("),
	Parsimmon.optWhitespace,
	Parsimmon.string("fun"),
	Parsimmon.optWhitespace,
	["argument", Parsimmon.regexp(/[a-z]+/)],
	Parsimmon.optWhitespace,
	["body", r.Program],
	Parsimmon.optWhitespace,
	Parsimmon.string(")")
    ).map((m)=>fun(m.argument)(m.body)),
    Application: (r) => Parsimmon.seqObj(
	Parsimmon.string("("),
	Parsimmon.optWhitespace,
	Parsimmon.string("app"),
	Parsimmon.optWhitespace,
	["first", r.Program],
	Parsimmon.optWhitespace,
	["second", r.Program],
	Parsimmon.optWhitespace,
	Parsimmon.string(")")
    ).map((m)=>app(m.first)(m.second)),
    Program: (r) => Parsimmon.alt(
	r.Symbol,
	r.Function,
	r.Application
    )
});

export const evaluate = (str) => force(language.Program.tryParse(str)({}));
