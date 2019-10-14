import Parsimmon from "parsimmon";
const language = Parsimmon.createLanguage({
    Program: (r) =>
        Parsimmon
            .alt(Parsimmon.regexp(/[a-zA-Z]/), r.Program)
            .sepBy(Parsimmon.optWhitespace)
            .wrap(Parsimmon.string("("), Parsimmon.string(")"))
            .trim(Parsimmon.optWhitespace)
});
export const parse = (input: string) => language.Program.tryParse(input);