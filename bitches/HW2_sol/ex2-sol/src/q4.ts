import { map } from "ramda";
import { Exp, Program, isProgram, isBoolExp, isNumExp, isVarRef, isPrimOp, isProcExp, isIfExp, isAppExp, isDefineExp, PrimOp, CExp } from '../imp/L3-ast';
import { Result, makeFailure, makeOk, bind, mapResult, safe2, safe3 } from '../shared/result';

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [Parsed | Error] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string>  => 
    isProgram(exp) ? bind(mapResult(l2ToPython, exp.exps), exps => makeOk(exps.join("\n"))) :
    isBoolExp(exp) ? makeOk(exp.val ? 'True' : 'False') :
    isNumExp(exp) ? makeOk(exp.val.toString()) :
    isVarRef(exp) ? makeOk(exp.var) :
    isDefineExp(exp) ? bind(l2ToPython(exp.val), val => makeOk(`${exp.var.var} = ${val}`)) :
    isIfExp(exp) ? safe3((test: string, then: string, alt: string) => makeOk(`(${then} if ${test} else ${alt})`))
        (l2ToPython(exp.test), l2ToPython(exp.then), l2ToPython(exp.alt)) :
    isPrimOp(exp) ? makeOk(convertPrimOp(exp.op)) :
    isProcExp(exp) ? bind(l2ToPython(exp.body[exp.body.length-1]), body => makeOk("(" + "lambda " +  
    map((p) => p.var, exp.args).join(",") + " : " + body + ")")) :
    isAppExp(exp) ?  
        (
         isPrimOp(exp.rator) ? primOpApp2Python(exp.rator, exp.rands) :
         safe2((rator: string, rands: string[]) => makeOk(`${rator}(${rands.join(",")})`))
            (l2ToPython(exp.rator), mapResult(l2ToPython, exp.rands))
         ) :
    makeFailure("Never");

const convertPrimOp = (op : string) : string =>
    op === "=" || op === "eq?" ? "==" :
    op === "number?" ? "(lambda x : type(x) == int or type (x) == float)" :
    op === "boolean?" ? "(lambda x : type(x) == bool)" :
    op;

const primOpApp2Python = (rator : PrimOp, rands : CExp[]) : Result<string> => 
    rator.op === "not" ? bind(l2ToPython(rands[0]), (rand : string) => makeOk("(not " + rand + ")")) :
    rator.op === "number?" || rator.op === "boolean?" ? bind(l2ToPython(rands[0]), (rand : string) => makeOk(`${convertPrimOp(rator.op)}(${rands[0]})`)) :
    bind(mapResult(l2ToPython,rands), (rands) => makeOk("(" + rands.join(" " + convertPrimOp(rator.op) + " ") + ")"));