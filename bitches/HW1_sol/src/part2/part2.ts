import * as R from "ramda";

const stringToArray = R.split("");

/* Question 1 */
export const countVowels: (s: string) => number = R.pipe(
    R.toLower,
    stringToArray,
    R.filter(R.includes(R.__, "aeiou")),
    R.length
);

/* Question 2 */
export const runLengthEncoding: (s: string) => string = R.pipe(
    stringToArray,
    (chars: string[]) => R.groupWith(R.equals, chars),
    R.map(x => [x[0], R.length(x)]),
    R.map(([c, n]) => n > 1 ? `${c}${n}` : c),
    R.join("")
);

/* Question 3 */
const popIfMatch = (stack: string[], openParen: string, closeParen: string): string[] =>
    R.isEmpty(stack) ? [closeParen] :
    R.head(stack) === openParen ? R.tail(stack) : R.prepend(closeParen, stack);

const isPairedReducer = (stack: string[], c: string): string[] =>
    c === "(" || c === "{" || c === "[" ? R.prepend(c, stack) :
    c === ")" ? popIfMatch(stack, "(", c) :
    c === "}" ? popIfMatch(stack, "{", c) :
    c === "]" ? popIfMatch(stack, "[", c) :
    stack;

export const isPaired: (s: string) => boolean = R.pipe(
    stringToArray,
    R.reduce(isPairedReducer, []),
    R.isEmpty
);
