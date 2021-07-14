// noinspection DuplicatedCode

import chai, { expect } from 'chai';

import { asycMemo, asyncWaterfallWithRetry, getAll, lazyFilter, lazyMap, makePromisedStore, MISSING_KEY } from '../src/part2';

import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

describe('2.1 (PromisedStore)', () => {
    it('(2pts) stores and retrieves value', async () => {
        const store = makePromisedStore()
        await store.set('a', 42)
        const a = await store.get('a')
        expect(a).to.equal(42)
    })

    it('(2pts) throws on missing key (get)', async () => {
        const store = makePromisedStore()
        await expect(store.get('a')).to.be.rejectedWith(MISSING_KEY)
    })

    it('(2pts) throws on missing key (delete)', async () => {
        const store = makePromisedStore()
        await expect(store.delete('a')).to.be.rejectedWith(MISSING_KEY)
    })

    it('(2pts) deletes a value', async () => {
        const store = makePromisedStore()
        await store.set('a', 42)
        await store.delete('a')
        await expect(store.get('a')).to.be.rejectedWith(MISSING_KEY)
    })

    it('(2pts) getAll retrieves an array', async () => {
        const store = makePromisedStore()
        await store.set('a', 42)
        await store.set('b', 24)
        expect(await getAll(store,['a', 'b'])).to.deep.equal([42, 24])
        expect(await getAll(store,['b', 'a'])).to.deep.equal([24, 42])
    })

    it('(1pts) getAll throws on missing value', async () => {
        const store = makePromisedStore()
        await store.set('a', 42)
        await expect(getAll(store,['a', 'b'])).to.be.rejectedWith(MISSING_KEY)
    })
})

describe('2.2 (asycMemo)', () => {
    it('(3pts) returns a promise', () => {
        const memo = asycMemo((x) => {})
        expect(memo('a')).to.be.instanceof(Promise)
    })

    it('(3pts) memoizes calls', async () => {
        let ret = 'cached'
        const memo = asycMemo((x) => ret)

        expect(await memo('a')).to.equal('cached')
        ret = 'new'
        expect(await memo('a')).to.equal('cached')
        expect(await memo('b')).to.equal('new')
    })

    it('(4pts) memoizes many calls', async () => {
        let ret: any[] = []
        const memo = asycMemo((i: number) => ret[i])
        for (let i = 0; i < 100; i++) {
            ret.push(`cached-${i}`)
        }
        for (let i = 0; i < 100; i++) {
            expect(await memo(i)).to.equal(`cached-${i}`)
        }
        for (let i = 0; i < 200; i++) {
            ret[i] = `new-${i}`
        }
        for (let i = 0; i < 100; i++) {
            expect(await memo(i)).to.equal(`cached-${i}`)
        }
        for (let i = 100; i < 200; i++) {
            expect(await memo(i)).to.equal(`new-${i}`)
        }
    }).timeout(5000)
})

describe('2.3 (lazy generators)', () => {
    function * countTo4(): Generator<number> {
        for (let i = 1; i <= 4; i++) {
            yield i
        }
    }

    it('(3pts) filters', () => {
        const gen = lazyFilter(countTo4, (v) => v % 2 == 0)()

        expect([...gen]).to.deep.equal([2, 4])
    })

    it('(3pts) maps', () => {
        const gen = lazyMap(countTo4, (v) => v ** 2)()

        expect([...gen]).to.deep.equal([1, 4, 9, 16])
    })
    //
    // it('filters twice', () => {
    //     const genFn = lazyFilter(countTo4, (v) => v % 2 == 0)
    //
    //     expect([...genFn()]).to.deep.equal([2, 4])
    //     expect([...genFn()]).to.deep.equal([2, 4])
    // }).skip()
    //
    // it('maps twice', () => {
    //     const genFn = lazyMap(countTo4, (v) => v ** 2)
    //
    //     expect([...genFn()]).to.deep.equal([1, 4, 9, 16])
    //     expect([...genFn()]).to.deep.equal([1, 4, 9, 16])
    // })//.skip()

    it('(4pts) returns iterable and not an array', () => {
        const gen1 = lazyFilter(countTo4, (v) => v % 2 == 0)()

        expect(gen1).to.have.property(Symbol.iterator)
        expect(gen1).to.not.be.instanceof(Array)

        const gen2 = lazyMap(countTo4, (v) => v ** 2)()

        expect(gen2).to.have.property(Symbol.iterator)
        expect(gen2).to.not.be.instanceof(Array)
    })
})

describe('2.4 (asyncWaterfallWithRetry)', () => {
    it('(5pts) executes sequence', async () => {
        const v = await asyncWaterfallWithRetry([async () => 1, async v => v + 1, async v => v * 2 ])
        expect(v).to.equal(4)
    })

    it('(5pts) retries twice', async () => {
        let attempt = 1
        const v = await asyncWaterfallWithRetry([async () => 1, async v => {
            if (attempt == 3)
                return v + 1
            attempt += 1
            throw Error()
        }, async v => v * 2 ])
        expect(v).to.equal(4)
    }).timeout(5000)

    it('(5pts) retries no more than twice', async () => {
        let attempt = 1
        await expect(asyncWaterfallWithRetry([async () => 1, async v => {
            if (attempt == 4)
                return v + 1
            attempt += 1
            throw Error('unique error')
        }, async v => v * 2 ])).to.be.rejectedWith('unique error')
    }).timeout(5000)
})