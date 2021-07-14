// Environment for L2 with mutation
// ================================
// An environment represents a partial function from symbols (variable names) to values.
// It supports the operation: apply-env(env,var)
// which either returns the value of var in the environment, or else throws an error.
//
// In L2-env - we saw a first solution supporting the definition of recursive functions with RecEnv / Letrec.
// It provides a solution to support recursion in a good way - but we could not achieve the same behavior as in Scheme
// with define expressions.
// We introduce here a new form of Env which supports mutation and mimics exactly the behavior of Scheme for define and set!.
//
// Box Environment
// ===============
// Represent an environment as a mapping from var to boxes containing values.
// The global environment is the root of all extended environment.
// It contains a frame that is initialized with primitive bindings
// and can be extended with the define operator.
//
// Box-Env is defined inductively by the following cases:
// * <box-env> ::= <global-env> | <extended-box-env>
// * <global-env> ::= (global-env frame) // global-env(frame:Box(Frame))
// * <extended-box-env> ::= (extended-box-env frame enclosing-env)
//      // extended-box-env(frame: Frame, enclosing-env: Box-env)
//
// Frame:
// * <fbinding> ::= (var val) // binding(var:string, val:Box(Value))
// * <frame> ::= (frame (var val)*) // frame(bindings:List(fbinding))
// applyFrame(frame, var) => val
//
// The key operation on env is applyEnv(env, var) which returns the value associated to var in env
// or returns an error if var is not defined in env.

import { add, map, zipWith } from "ramda";
import { Value } from './L21-value-store';
import { Result, makeFailure, makeOk, bind, either } from "../shared/result";

// ========================================================
// Box datatype
// Encapsulate mutation in a single type.
export type Box<T> = T[];
export const makeBox = <T>(x: T): Box<T> => ([x]);
export const unbox = <T>(b: Box<T>): T => b[0];
const setBox = <T>(b: Box<T>, v: T): void => { b[0] = v; return; }

// ========================================================
// Store datatype
export interface Store {
    tag: "Store";
    vals: Box<Value>[];
}

export const isStore = (x: any): x is Store => x.tag === "Store";
export const makeEmptyStore = (): Store => ({tag: "Store", vals: []});
export const theStore: Store = makeEmptyStore();
export const extendStore = (s: Store, val: Value): Store => {
    const boxedVal: Box<Value> = makeBox(val)
    // const newVals: Box<Value>[] = s.vals.concat([boxedVal])
    s.vals = s.vals.concat([boxedVal])
    return s;
}
    
export const applyStore = (store: Store, address: number): Result<Value> =>
    makeOk(unbox(store.vals[address]));
    
export const setStore = (store: Store, address: number, val: Value): void => {
    setBox(store.vals[address], val); return;
};

// ========================================================
// Environment data type
// export type Env = EmptyEnv | ExtEnv;
export type Env = GlobalEnv | ExtEnv;

interface GlobalEnv {
    tag: "GlobalEnv";
    vars: Box<string[]>;
    addresses: Box<number[]>
}

export interface ExtEnv {
    tag: "ExtEnv";
    vars: string[];
    addresses: number[];
    nextEnv: Env;
}

const makeGlobalEnv = (): GlobalEnv =>
    ({tag: "GlobalEnv", vars: makeBox([]), addresses:makeBox([])});

export const isGlobalEnv = (x: any): x is GlobalEnv => x.tag === "GlobalEnv";

// There is a single mutable value in the type Global-env
export const theGlobalEnv = makeGlobalEnv();

export const makeExtEnv = (vs: string[], addresses: number[], env: Env): ExtEnv =>
    ({tag: "ExtEnv", vars: vs, addresses: addresses, nextEnv: env});

const isExtEnv = (x: any): x is ExtEnv => x.tag === "ExtEnv";

export const isEnv = (x: any): x is Env => isGlobalEnv(x) || isExtEnv(x);

// Apply-env
export const applyEnv = (env: Env, v: string): Result<number> =>
    isGlobalEnv(env) ? applyGlobalEnv(env, v) :
    applyExtEnv(env, v);

const applyGlobalEnv = (env: GlobalEnv, v: string): Result<number> => {
    const pos = unbox(env.vars).indexOf(v);
    return (pos > -1) ? makeOk(unbox(env.addresses)[pos]) : makeFailure(`Var not found: ${v}`);    
}

export const globalEnvAddBinding = (v: string, addr: number): void => {
    setBox(theGlobalEnv.vars, unbox(theGlobalEnv.vars).concat([v]))
    setBox(theGlobalEnv.addresses, unbox(theGlobalEnv.addresses).concat([addr]))
}

const applyExtEnv = (env: ExtEnv, v: string): Result<number> =>
    env.vars.includes(v) ? makeOk(env.addresses[env.vars.indexOf(v)]) :
    applyEnv(env.nextEnv, v);

export const applyEnvStore = (e: Env, s: Store, v: string): Result<Value> =>
    bind(applyEnv(e,v), (addr: number) => applyStore(s, addr))
