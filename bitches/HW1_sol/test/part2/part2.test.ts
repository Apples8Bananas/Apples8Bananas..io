import { expect } from "chai";
import { countVowels, runLengthEncoding, isPaired } from "../../src/part2/part2";

describe("Assignment 1 Part 2", () => {
    describe("countVowels", () => {
        it("counts vowels", () => {
            expect(countVowels("This is some Text")).to.equal(5);
            expect(countVowels("")).to.equal(0);
            expect(countVowels("Why?")).to.equal(0);
            expect(countVowels("AaEeIiOoUu")).to.equal(10);
        });
    });

    describe("runLengthEncoding", () => {
        it("compresses a string", () => {
            expect(runLengthEncoding("aaaabbbccd")).to.equal("a4b3c2d");
            expect(runLengthEncoding("a")).to.equal("a");
            expect(runLengthEncoding("abba")).to.equal("ab2a");
            expect(runLengthEncoding("")).to.equal("");
            expect(runLengthEncoding("aaaaaaaaa")).to.equal("a9");
        });
    });

    describe("isPaired", () => {
        it("returns true for a string with paired parens", () => {
            expect(isPaired("([{}])")).to.be.true;
            expect(isPaired("This is ([some]) {text}.")).to.be.true;
            expect(isPaired("No parens, no problems.")).to.be.true;
            expect(isPaired("")).to.be.true;
        });

        it("returns false when the parens are not paired", () => {
            expect(isPaired("(]")).to.be.false;
            expect(isPaired("This is ]some[ }text{")).to.be.false;
            expect(isPaired("(")).to.be.false;
            expect(isPaired(")(")).to.be.false;
        });
    });
});