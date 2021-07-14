// L2-eval-box.ts
// L2 with mutation (set!) and env-box model
// Direct evaluation of letrec with mutation, define supports mutual recursion.

import { map, reduce, repeat, zipWith } from "ramda";
import { isBoolExp, isCExp, isLitExp, isNumExp, isPrimOp, isStrExp, isVarRef,
         isAppExp, isDefineExp, isIfExp, isLetExp, isProcExp, Binding, VarDecl, CExp, Exp, IfExp, LetExp, ProcExp, Program,
         parseL21Exp, 
         DefineExp,
         isSetExp,
         SetExp} from "./L21-ast";
import { applyEnv, makeExtEnv, Env, Store, setStore, extendStore, ExtEnv, applyEnvStore, theGlobalEnv, globalEnvAddBinding, theStore } from "./L21-env-store";
import { isClosure, makeClosure, Closure, Value } from "./L21-value-store";
import { applyPrimitive } from "./evalPrimitive-store";
import { first, rest, isEmpty } from "../shared/list";
import { Result, bind, safe2, mapResult, makeFailure, makeOk } from "../shared/result";
import { parse as p } from "../shared/parser";

// ========================================================
// Eval functions

const applicativeEval = (exp: CExp, env: Env, s: Store): Result<Value> =>
    isNumExp(exp) ? makeOk(exp.val) :
    isBoolExp(exp) ? makeOk(exp.val) :
    isStrExp(exp) ? makeOk(exp.val) :
    isPrimOp(exp) ? makeOk(exp) :
    isVarRef(exp) ? applyEnvStore(env, s, exp.var) :
    isLitExp(exp) ? makeOk(exp.val as Value) :
    isIfExp(exp) ? evalIf(exp, env, s) :
    isProcExp(exp) ? evalProc(exp, env) :
    isLetExp(exp) ? evalLet(exp, env, s) :
    isAppExp(exp) ? safe2((proc: Value, args: Value[]) => applyProcedure(proc, args, s))
                        (applicativeEval(exp.rator, env, s), mapResult((rand: CExp) => applicativeEval(rand, env, s), exp.rands)) :
    isSetExp(exp) ? evalSet(exp, env, s):
    exp;

export const isTrueValue = (x: Value): boolean =>
    ! (x === false);

const evalIf = (exp: IfExp, env: Env, s: Store): Result<Value> =>
    bind(applicativeEval(exp.test, env, s),
         (test: Value) => isTrueValue(test) ? applicativeEval(exp.then, env, s) : applicativeEval(exp.alt, env, s));

const evalProc = (exp: ProcExp, env: Env): Result<Closure> =>
    makeOk(makeClosure(exp.args, exp.body, env));

// L4-eval-box: Handling of mutation with set!
const evalSet = (exp: SetExp, env: Env, s: Store): Result<void> =>
    safe2((val: Value, address: number) => makeOk(setStore(s, address, val)))
        (applicativeEval(exp.val, env, s), applyEnv(env, exp.var.var));


// KEY: This procedure does NOT have an env parameter.
//      Instead we use the env of the closure.
const applyProcedure = (proc: Value, args: Value[], s: Store): Result<Value> =>
    isPrimOp(proc) ? applyPrimitive(proc, args) :
    isClosure(proc) ? applyClosure(proc, args, s) :
    makeFailure(`Bad procedure ${JSON.stringify(proc)}`);

const applyClosure = (proc: Closure, args: Value[], s: Store): Result<Value> => {
    const vars = map((v: VarDecl) => v.var, proc.params);
    const baseAddr: number = s.vals.length
    const newStore: Store = reduce(extendStore, s, args)
    const addresses: number[] = map((n) => n + baseAddr, Array.from(Array(args.length).keys()))
    const newEnv: ExtEnv = makeExtEnv(vars, addresses, proc.env)
    return evalSequence(proc.body, newEnv, newStore);
}

// Evaluate a sequence of expressions (in a program)
export const evalSequence = (seq: Exp[], env: Env, s: Store): Result<Value> =>
    isEmpty(seq) ? makeFailure("Empty program") :
    evalCExps(first(seq), rest(seq), env, s);
    
const evalCExps = (first: Exp, rest: Exp[], env: Env, s: Store): Result<Value> =>
    isDefineExp(first) ? evalDefineExps(first, rest, s) :
    isCExp(first) && isEmpty(rest) ? applicativeEval(first, env, s) :
    isCExp(first) ? bind(applicativeEval(first, env, s), _ => evalSequence(rest, env, s)) :
    first;

// Eval a sequence of expressions when the first exp is a Define.
// Compute the rhs of the define, extend the env with the new binding
// then compute the rest of the exps in the new env.
// L2-BOX @@
// define always updates theGlobalEnv
// We also only expect defineExps at the top level.
// const evalDefineExps = (def: DefineExp, exps: Exp[], env: Env, s: Store): Result<Value> =>
//     bind(applicativeEval(def.val, env, s),
//             (rhs: Value) => {
//                 const newStore = extendStore(s, rhs);
//                 const address = s.vals.length;
//                 return evalSequence(exps, makeExtEnv([def.var.var], [address], env),newStore);
//             })


const evalDefineExps = (def: DefineExp, exps: Exp[], s: Store): Result<Value> =>
    bind(applicativeEval(def.val, theGlobalEnv, s),
            (rhs: Value) => {
                const addr: number = s.vals.length
                const newStore = extendStore(s, rhs)
                globalEnvAddBinding(def.var.var, addr);
                return evalSequence(exps, theGlobalEnv, newStore);
            });
// Main program
// L2-BOX @@ Use GE instead of empty-env
export const evalProgram = (program: Program): Result<Value> =>
    evalSequence(program.exps, theGlobalEnv, theStore);

export const evalParse = (s: string): Result<Value> =>
    bind(bind(p(s), parseL21Exp), (exp: Exp) => evalSequence([exp], theGlobalEnv, theStore));

// LET: Direct evaluation rule without syntax expansion
// compute the values, extend the env, eval the body.
const evalLet = (exp: LetExp, env: Env, s: Store): Result<Value> => {
    const vals = mapResult((v: CExp) => applicativeEval(v, env, s), map((b: Binding) => b.val, exp.bindings));
    const vars = map((b: Binding) => b.var.var, exp.bindings);

    const baseAddr = s.vals.length
    
    return bind(vals, (vals: Value[]) => {
        const addresses = map((n) => n + baseAddr, Array.from(Array(vals.length).keys()))
        const newStore = reduce(extendStore, s, vals)
        const newEnv = makeExtEnv(vars, addresses, env)
        return evalSequence(exp.body, newEnv, newStore);
    })
}
