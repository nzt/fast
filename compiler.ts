import Parsimmon from "parsimmon";
import { Operation } from "./vm";

export const compile = (s: string): Operation[] => {
    const indexer = (function*() {
        for(let i = 0;; i++) {
            yield i;
        }
    })();

    const language = Parsimmon.createLanguage({
        Symbol: () =>
            Parsimmon
                .seqObj<{symbol: string}>(
                    Parsimmon.string("("),
                    Parsimmon.optWhitespace,
                    Parsimmon.string("S"),
                    Parsimmon.optWhitespace,
                    ["symbol", Parsimmon.regexp(/[a-zA-Z]/)],
                    Parsimmon.optWhitespace,
                    Parsimmon.string(")")
                )
                .map((m): Operation[] =>[{index: indexer.next().value, opcode: "S", operand: [m.symbol.charCodeAt(0),0]}]),
        Function: (r) => 
            Parsimmon
                .seqObj<{argument: string, body: Operation[]}>(
                    Parsimmon.string("("),
                    Parsimmon.optWhitespace,
                    Parsimmon.string("F"),
                    Parsimmon.optWhitespace,
                    ["argument", Parsimmon.regexp(/[a-z]+/)],
                    Parsimmon.optWhitespace,
                    ["body", Parsimmon.alt(r.Symbol, r.Function, r.Application)],
                    Parsimmon.optWhitespace,
                    Parsimmon.string(")")
                )
                .map((m): Operation[] => [{ index: indexer.next().value, opcode: "F", operand: [m.body[0].index, m.argument.charCodeAt(0)] }, ...m.body]),
        Application: (r) =>
            Parsimmon
                .seqObj<{[k:string]: Operation[]}>(
                    Parsimmon.string("("),
                    Parsimmon.optWhitespace,
                    Parsimmon.string("A"),
                    Parsimmon.optWhitespace,
                    ["first", Parsimmon.alt(r.Symbol, r.Function, r.Application)],
                    Parsimmon.optWhitespace,
                    ["second", Parsimmon.alt(r.Symbol, r.Function, r.Application)],
                    Parsimmon.optWhitespace,
                    Parsimmon.string(")")
                )
                .map((m): Operation[] => [{ index: indexer.next().value, opcode: "A", operand: [m.first[0].index, m.second[0].index] }, ...m.first, ...m.second]),
        Toplevel: (r) =>
            Parsimmon
                .alt(r.Symbol, r.Function, r.Application)
                .trim(Parsimmon.optWhitespace)
                .map((toplevel): Operation[] =>[{index: indexer.next().value, opcode: "T", operand: [toplevel[0].index, 0]}, ...toplevel].sort((a, b)=>(a.index - b.index)))
    });

    return language.Toplevel.tryParse(s);
};

export const dump = (op: Operation[]) => {
    return Uint8Array.from((new Array<number>()).concat(...op.map(({ opcode, operand })=>[opcode.charCodeAt(0), ...operand])));
}

export const read = (bin: Uint8Array) => {
    let op: Operation[] = [];
    for(let i = 0; i < bin.length; i += 3) {
        op.push({ index: i / 3, opcode: String.fromCharCode(bin[i]), operand: [bin[i+1], bin[i+2]] });
    }
    return op;
}