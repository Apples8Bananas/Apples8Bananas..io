import { State, bind } from "./state";

export type Queue = number[];

export const enqueue = (x: number): State<Queue, undefined> =>
    q => [q.concat(x), undefined];

export const dequeue: State<Queue, number> = q => [q.slice(1), q[0]];

export const queueManip: State<Queue, number> =
    bind(dequeue,
         x => bind(enqueue(2 * x),
                   _ => bind(enqueue(x / 3),
                             _ => dequeue)));
