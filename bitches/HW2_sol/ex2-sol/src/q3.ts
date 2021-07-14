import { map, zipWith } from "ramda";
import { isLitExp, makeLitExp, BoolExp, makePrimOp, IfExp, makeVarRef, makeVarDecl, isClassExp, makeClassExp, isLetExp, makeLetExp, makeBinding, Binding, ClassExp, ProcExp, Exp, Program, makeAppExp, makeProcExp, isNumExp, isBoolExp, isPrimOp, isVarRef, isAppExp, CExp, isIfExp, makeIfExp, isProcExp, makeProgram, isDefineExp, makeDefineExp, isProgram, isExp } from "./L31-ast";
import { Result, bind, makeFailure, makeOk, mapResult, safe2, safe3 } from "../shared/result";
import { makeSymbolSExp } from "../imp/L3-value";
import { makeBoolExp } from "../imp/L3-ast";
import { first, rest, isEmpty } from "../shared/list";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp =>
    //{ console.log(exp); console.log(makeProcExp(exp.fields,[makeProcExp([makeVarDecl('msg')],[buildIfExp(exp.methods)])])); return makeProcExp(exp.fields,[makeProcExp([makeVarDecl('msg')],[buildIfExp(exp.methods)])]); }
    makeProcExp(exp.fields,[makeProcExp([makeVarDecl('msg')],[buildIfExp(exp.methods)])]);

const buildIfExp = (bindings : Binding[]) : IfExp | BoolExp =>
        !isEmpty(bindings) ?
            makeIfExp(makeAppExp(makePrimOp('eq?'),[makeVarRef('msg'), makeLitExp(makeSymbolSExp(bindings[0].var.var))]),
                makeAppExp(first(bindings).val,[]),
                buildIfExp(rest(bindings))) :
        makeBoolExp(false);

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/

export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
    isProgram(exp) ? bind(mapResult(L31ExpToL3, exp.exps), (exps: Exp[]) => makeOk(makeProgram(exps))) :
    isExp(exp) ? L31ExpToL3(exp) :
    makeFailure("Never");

export const L31ExpToL3 = (exp: Exp): Result<Exp> =>
    isDefineExp(exp) ? bind(L31CExpToL3(exp.val), (val: CExp) => makeOk(makeDefineExp(exp.var, val))) :
    L31CExpToL3(exp);

export const L31CExpToL3 = (exp: CExp): Result<CExp> =>
    isNumExp(exp) ? makeOk(exp) :
    isBoolExp(exp) ? makeOk(exp) :
    isPrimOp(exp) ? makeOk(exp) :
    isVarRef(exp) ? makeOk(exp) :
    isAppExp(exp) ? safe2((rator: CExp, rands: CExp[]) => makeOk(makeAppExp(rator, rands)))
                        (L31CExpToL3(exp.rator), mapResult(L31CExpToL3, exp.rands)) :
    isIfExp(exp) ? safe3((test: CExp, then: CExp, alt: CExp) => makeOk(makeIfExp(test, then, alt)))
                    (L31CExpToL3(exp.test), L31CExpToL3(exp.then), L31CExpToL3(exp.alt)) :
    isProcExp(exp) ? bind(mapResult(L31CExpToL3, exp.body), (body: CExp[]) => makeOk(makeProcExp(exp.args, body))) :
    isLetExp(exp) ? safe2((vals : CExp[], body: CExp[]) => makeOk(makeLetExp(zipWith(makeBinding,map(binding => binding.var.var, exp.bindings), vals), body)))
               (mapResult((binding : Binding ) => L31CExpToL3(binding.val), exp.bindings), mapResult(L31CExpToL3,exp.body)) :
    isClassExp(exp) ? bind(mapResult((binding : Binding ) => L31CExpToL3(binding.val), exp.methods),
                           (vals : CExp[]) => makeOk(
                               class2proc(
                                   makeClassExp(exp.fields, 
                                    zipWith(makeBinding,map(binding => binding.var.var, exp.methods), vals))))) :
    isLitExp(exp) ? makeOk(exp) :
    makeFailure(`Unexpected CExp: ${exp.tag}`);