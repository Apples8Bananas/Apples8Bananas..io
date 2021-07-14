// to install ramda :   npm i ramda
import { map, filter, reduce, compose } from "ramda";

//=====================================================>
// This TypeScript program
function add1(a: number, b: number): number {
    return a + b;
}
add1(1, 3); // ==> 4

// is translated by `tsc` into this JavaScript program:
function add2(a, b) {
    return a + b;
}
add2(1, 3); // ==> 4

//=====================================================>

let numberArr : number[] = [1, 2, 3];
let num: number = numberArr[0];
console.log(num); // ==> 1

//=====================================================>
let s1:{ name: string, cs: boolean, age: number } = { name: "avi", cs: true, age: 22 };
s1; // => { name: 'avi', cs: true, age: 22 }

//=====================================================>
interface Student {
    name: string;
    cs: boolean;
    age: number;
}

let s: Student = { name: "avi", cs: true, age: 22 };
s; // => { name: 'avi', cs: true, age: 22 }

//=====================================================>
interface NumberLink {
    num: number;
    next?: NumberLink;
}

let lst1: NumberLink = {
    num: 1,
    next: {
        num: 2,
        // The last element does NOT have a next field.
        next: { num: 3 },
    }
};

lst1; // => { num: 1, next: { num: 2, next: { num: 3 } } }

//=====================================================>
const printNumberLinkedList: (list: NumberLink) => void = list => {
    // We know list.num is a number
    console.log(list.num);

    // list.next can either be undefined or a NumberLink
    if (list.next === undefined) {
        console.log("end of list");
    } else {
        // It is safe to pass a NumberLink value
        // to the recursive call
        printNumberLinkedList(list.next);
    }
};

printNumberLinkedList({ num: 1, next: { num: 2, next: { num: 3 } } });

//=====================================================>
interface Link<T> {
    x: T;
    next?: Link<T>;
}


let lst2: Link<string> = {
    x: "avi",
    next: { x: "bob", next: { x: "charles" } }
};

lst2; // ==> { x: 'avi', next: { x: 'bob', next: { x: 'charles' } } }

//=====================================================>
let lst3: Link<{ name: string }> = {
    x: { name: "xx" },
    next: { x: { name: "yy" }, next: { x: { name: "last" } } }
};

lst3; // ==> { x: { name: 'xx' }, next: { x: { name: 'yy' }, next: { x: [Object] } } }

//=====================================================>
let lst4: Link<any> = {
    x: "hi",
    next: { x: 1, next: { x: "bye" } }
};

lst4; // ==> { x: 'hi', next: { x: 1, next: { x: 'bye' } } }

//=====================================================>
const countLink: <T>(list: Link<T>) => number = (list) => {
    return list.next === undefined ? 1 : 1 + countLink(list.next);
};

countLink({ x: "hi", next: { x: "hello", next: { x: "bye" } } }); // => 3

//=====================================================>
const printLink: <T>(list: Link<T>) => void = (list) => {
    console.log(list.x);
    list.next === undefined ? console.log("end of list") : printLink(list.next);
};

printLink({ x: "hi", next: { x: "hello", next: { x: "bye" } } });
// ==>
// hi
// hello
// bye
// end of list

printLink({ x: 1, next: { x: 2, next: { x: 3 } } });
// ==>
// 1
// 2
// 3
// end of list

//=====================================================>
const squareSumList: (list: Link<number>, acc: number) => number = (list, acc) => {
    if (list.next === undefined) return acc + list.x * list.x;
    else return squareSumList(list.next, acc + list.x * list.x);
};

squareSumList({ x: 1, next: { x: 2, next: { x: 3 } } }, 0); // = 1*1 + 2*2 + 3*3
// ==> 14

//=====================================================>
interface Tree<T> {
    root: T;
    children: Tree<T>[];
}

// A tree of number nodes with just a root
let numbersTree: Tree<number> = {
    root: 1,
    children: []
};

// A tree of string nodes with just a root
let stringsTree: Tree<string> = {
    root: "tirgul 2",
    children: []
};

// A tree of numbers with one root and 2 children.
let t1: Tree<number> = {
    root: 1,
    children: [
        { root: 2, children: [] },
        { root: 3, children: [] }
    ]
};

// A heterogeneous tree with string and number nodes
let anyTree: Tree<any> = {
    root: "numbers and strings",
    children: [numbersTree, stringsTree]
};

anyTree;
// ==>
//    { root: 'numbers and strings',
//      children: 
//       [ { root: 1, children: [] },
//         { root: 'tirgul 2', children: [] } ] }

//=====================================================>
const t: Tree<number> = {
    root: 0,
    children: [
        { root: 2, children: [{ root: 4, children: [] }] },
        { root: 1, children: [{ root: 3, children: [] }] }
    ]
};


//=====================================================>
function getChild<T>(t: Tree<T>, path: number[]): Tree<T> {
    if (path.length === 0)
        // end of path
        return t;
    else if (t.children.length === 0)
        // t is a leaf - cannot go down
        return t;
    else return getChild(t.children[path[0]], path.slice(1)); // recursive case
}
console.log(getChild(t, [0, 0])); // ==> { root: 2, children: [] }
console.log(getChild(t, [1, 0])); // ==> { root: 3, children: [] }
console.log(getChild(t, [1, 0, 0, 0])); // ==> { root: 3, children: [] } (Do not go "after" the leaves.)


//=====================================================>
// Named function
function addT(x: number, y: number): number {
    return x + y;
}

// Anonymous function
const myAdd = function (x: number, y: number): number {
    return x + y;
};

// Using the fat arrow notation:
const myFatAdd = (x: number, y: number): number => x + y;

myFatAdd(2, 4); // ==> 6

//=====================================================>
const myAdd1: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};

const myFatAdd1: (x: number, y: number) => number = (x: number, y: number): number => x + y;

myFatAdd1(2, 7); // ==> 9

//=====================================================>
const square = x => x * x;
square(10); // ==> 100

//=====================================================>
const id = x => x;
console.log(`${id(0)}`); // ==> 0
console.log(`${id("tirgul 2")}`); // ==> tirgul 2

//=====================================================>
let unionFunc = x => {
    if (x === 0) return 0;
    else return false;
};

console.log(`${unionFunc(0)}`); // ==> 0
console.log(`${unionFunc(5)}`); // ==> false

//=====================================================>

let numbersArray1 = map(x => x + 1, [1, 2, 3]);
let stringsArray2 = map(x => x + "d", ["a", "b", "c"]);
console.log(numbersArray1); // ==> [ 2, 3, 4 ]
console.log(stringsArray2); // ==> [ 'ad', 'bd', 'cd' ]

//=====================================================>
let numbersArray = filter(x => x % 2 === 0, [1, 2, 3]);
let stringsArray = filter(x => x[0] === "d", ["david", "dani", "moshe"]);
console.log(numbersArray); // ==> [ 2 ]
console.log(stringsArray); // ==> [ 'david', 'dani' ]

//=====================================================>
let num1 = reduce((acc, curr) => acc + curr, 0, [1, 2, 3]);
let count = reduce((acc, curr) => acc + curr.length, 0, ["a", "bc", "def"]);
console.log(num1); // ==> 6
console.log(count); // ==> 6

//=====================================================>
let hn = compose((y: number) => y * y, x => x + 1);
hn(3); // ==> (3 + 1) * (3 + 1) = 16

// Reverse a string: 
// - Make an array of chars out of the string (split(""))
// - Reverse the array
// - Join the chars back into a string array.join("")
const reverse: (s: string) => string = s => s.split("").reverse().join("");
reverse("abcd"); // ==> 'dcba'

// Return a new string with all upper case chars
const upper: (s: string) => string = s => s.toUpperCase();
upper("abcd"); // ==> 'ABCD'

let upperReverse: (s: string) => string = compose(reverse, upper);
upperReverse("abcd"); // ==> 'DCBA'