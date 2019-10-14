OCAMLC=ocamlc
OCAMLOPT=ocamlopt
OCAMLLEX=ocamllex
OCAMLYACC=ocamlyacc
OCAMLDEP=ocamldep

all: main main.opt

main: src/interpreter.cmo src/compiler.cmo src/parser.cmo src/lexer.cmo src/main.cmo 
	$(OCAMLC) -I src -o $@ $^

main.opt: src/interpreter.cmx src/compiler.cmx src/parser.cmx src/lexer.cmx src/main.cmx 
	$(OCAMLOPT) -I src -o $@ $^

src/lexer.ml: src/lexer.mll
	$(OCAMLLEX) $<

src/parser.ml: src/parser.mly
	$(OCAMLYACC) $<

src/parser.mli: src/parser.mly
	$(OCAMLYACC) $<

.SUFFIXES: .mll .mly .ml .mli .cmo .cmi .cmx

.ml.cmo:
	$(OCAMLC) -I src -c $<

.mli.cmi:
	$(OCAMLC) -I src -c $<

.ml.cmx:
	$(OCAMLOPT) -I src -c $<

.PHONY: clean depend

clean:
	rm --force src/parser.ml src/parser.mli src/lexer.ml
	rm --force main main.opt $(shell find . -name "*.cmi" -or -name "*.cmo" -or -name "*.cmx" -or -name "*.o")

depend: src/parser.ml src/parser.mli src/lexer.ml
	$(OCAMLDEP) `find . -name "*.ml" -or -name "*.mli"` > .depend

include .depend
