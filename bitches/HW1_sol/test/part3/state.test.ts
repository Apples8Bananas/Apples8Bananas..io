import { expect } from "chai";
import { bind } from "../../src/part3/state";

const random = (seed: number): number =>
    (80189 * seed + 190886) % 1052010;

const die = (seed: number): [number, number] => {
    const newSeed = random(seed);
    const die = 1 + Math.floor(newSeed / 1052010 * 6);
    return [newSeed, die];
};

describe("State Monad", () => {
    describe("bind", () => {
        it("works on the dice example", () => {
            const rollTwoDice = bind(die, d1 => bind(die, d2 => s => [s, [d1, d2]]));
            expect(rollTwoDice(42)[1]).to.deep.equal([3, 6]);
        });
    });
});