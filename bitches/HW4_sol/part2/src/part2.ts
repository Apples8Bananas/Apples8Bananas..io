export const MISSING_KEY = '___MISSING___'

type PromisedStore<K, V> = {
    get(key: K): Promise<V>,
    set(key: K, value: V): Promise<void>,
    delete(key: K): Promise<void>
}

// note that new version of Node.js have a setTimeout
// that returns a Promise built-in in the 'timers/promises' module
async function setTimeoutP(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), milliseconds)
    })
}

export function makePromisedStore<K, V>(): PromisedStore<K, V> {
    const map = new Map<K, V>()
    return {
        get(key: K) {
            return new Promise<V>((resolve, reject) => {
                const v = map.get(key)
                typeof v !== 'undefined' ? resolve(v) : reject(MISSING_KEY)
            })
        },
        set(key: K, value: V) {
            return new Promise<void>((resolve) => {
                // we only use setTimeoutP to test that asyncMemo works properly
                // it makes sure when set and get are called in sequence
                // get will be called first.
                // by itself it's not a part of the assignment
                setTimeoutP(0).then(() => {
                    map.set(key, value)
                    resolve()
                })
            })
        },
        delete(key: K) {
            return new Promise<void>((resolve, reject) => {
                map.delete(key) ? resolve() : reject(MISSING_KEY)
            })
        },
    }
}

export function getAll<K, V>(store: PromisedStore<K, V>, keys: K[]): Promise<V[]> {
    const promises = keys.map(key => store.get(key))
    return Promise.all(promises)
}

export function asycMemo<T, R>(f: (param: T) => R): (param: T) => Promise<R> {
    const store = makePromisedStore<T, R>()
    return async (param: T): Promise<R> => {
        try {
            return await store.get(param)
        } catch {
            const retVal = f(param)
            await store.set(param, retVal)
            return retVal
        }
    }
}

export function lazyFilter<T>(genFn: () => Generator<T>, filterFn: (value: T) => boolean): () => Generator<T> {
    return function * () {
        for (const v of genFn()) {
            if (filterFn(v)) {
                yield v
            }
        }
    }
}

export function lazyMap<T, R>(genFn: () => Generator<T>, mapFn: (value: T) => R): () => Generator<R> {
    return function * () {
        for (const v of genFn()) {
            yield mapFn(v)
        }
    }
}

async function attempt3Times(fn: () => Promise<any>) {
    for (let i = 1; i <= 2; i++) {
        try {
            return await fn()
        } catch {
            await setTimeoutP(2000)
        }
    }
    return fn()
}

export async function asyncWaterfallWithRetry(fns: [() => Promise<any>, ...((param: any) => Promise<any>)[]]) {
    const [firstF, ...restFns] = fns
    let retVal = await attempt3Times(firstF)
    for (const f of restFns) {
        retVal = await attempt3Times(() => f(retVal))
    }
    return retVal
}
