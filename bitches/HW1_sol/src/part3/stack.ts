import { prepend } from "ramda";
import { State, bind } from "./state";

export type Stack = number[];

export const push = (x: number): State<Stack, undefined> =>
    s => [prepend(x, s), undefined];

export const pop: State<Stack, number> = s => [s.slice(1), s[0]];

export const stackManip: State<Stack, undefined> =
    bind(pop,
         x => bind(push(x * x),
                   _ => bind(pop,
                             y => push(x + y))));
