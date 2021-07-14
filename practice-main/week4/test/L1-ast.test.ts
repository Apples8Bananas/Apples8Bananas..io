import { expect } from "chai";
import { isAppExp, makePrimOp, parseL1CExp } from "../src/L1/L1-ast";
import { parse as parseSexp } from "../src/shared/parser";
import { bind, isOkT } from "../src/shared/result";

describe("L1 Parsing", () => {
    it("parses AppExps correctly", () => {
        const result = bind(parseSexp("(> 1 2)"), parseL1CExp);
        if (isOkT(isAppExp)(result)) {
            expect(result.value.rator).to.deep.equal(makePrimOp(">"));
        } else {
            expect.fail("Could not parse (> 1 2) as AppExp.");
        }
    });
});