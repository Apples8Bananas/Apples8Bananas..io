import { expect } from "chai";
import * as R from "../../src/lib/result";
import * as F from "../../src/part3/find";

describe("Find", () => {
    describe("findResult", () => {
        it("returns a Failure when no element was found", () => {
            const result = F.findResult(x => x.length > 3, ["dog", "cat", "rat"]);
            expect(result).to.satisfy(R.isFailure);
        });

        it("returns an Ok when an element was found", () => {
            const result = F.findResult(x => x.length > 3, ["raccoon", "ostrich", "slug"]);
            expect(result).to.satisfy(R.isOk);
            expect(result).to.deep.equal(R.makeOk("raccoon"));
        });
    });

    describe("returnSquaredIfFoundEven", () => {
        it("returns an Ok of the first even number squared in v2", () => {
            expect(F.returnSquaredIfFoundEven_v2([1, 2, 3])).to.deep.equal(R.makeOk(4));
            expect(F.returnSquaredIfFoundEven_v2([32, 64, 128])).to.deep.equal(R.makeOk(1024));
        });

        it("return a Failure if no even numbers are in the array in v2", () => {
           expect(F.returnSquaredIfFoundEven_v2([1, 3, 5])).to.satisfy(R.isFailure);
           expect(F.returnSquaredIfFoundEven_v2([])).to.satisfy(R.isFailure);
        });

        it("returns the first even number squared in v3", () => {
            expect(F.returnSquaredIfFoundEven_v3([1, 2, 3])).to.equal(4);
            expect(F.returnSquaredIfFoundEven_v3([32, 64, 128])).to.equal(1024);
        });

        it("returns -1 if no even numbers are in the array in v3", () => {
            expect(F.returnSquaredIfFoundEven_v3([1, 3, 5])).to.equal(-1);
            expect(F.returnSquaredIfFoundEven_v3([])).to.equal(-1);
        });
    });
});