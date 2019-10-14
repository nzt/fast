import { Operation } from "./vm";
import { parse } from "./parser";

export const compile = (ast: ReturnType<typeof parse>): Operation[] => {
    const indexer = (function*() {
        for(let i = 0;; i++) {
            yield i;
        }
    })();
    const generate = (ast: ReturnType<typeof parse>): Operation[] => {
        switch (ast[0]) {
            case "F": {
                const t = generate(ast[2]);
                return [{index: indexer.next().value, opcode: ast[0], operand: [t[0].index, ast[1].charCodeAt(0)]}, ...t]
            }
            case "A": {
                const t = generate(ast[1]);
                const u = generate(ast[2]);
                return [{ index: indexer.next().value, opcode: ast[0], operand: [t[0].index, u[0].index] }, ...t, ...u]
            }
            case "S": {
                return [{ index: indexer.next().value, opcode: ast[0], operand: [ast[1].charCodeAt(0),0]}]
            }
        }
    }
    const op = generate(ast);
    return [{index: indexer.next().value, opcode: "T", operand: [op[0].index, 0]}, ...op].sort((a, b)=>a.index - b.index)
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