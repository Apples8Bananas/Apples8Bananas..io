// PPL_PS1_3.ts

// ## 3. Exercises: 

// ### 3.1 Implement the `map` method using `reduce`.

/*
    Let's think step by step: What should be our *accumulated* value? It is natural to think that the accumulation consists in 'pushing' the current element 
    **as a mapped value** to the currently accumulated array.
    
    To that end, the initial value should be the empty array. 
    As we go, we will take the current element, and our next accumulator will be the current accumulator, 
    only expanded by the current element after it is mapped by the transformer.
*/

// ### 3.2 Implement `filter` using `reduce`.

/*
    What should be changed in the solution of the previous exercise?  
    We can skip adding the current element if it does not satisfy the predicate, 
    in which case the next accumulator will not change. 
    However, if the current element does satisfy the predicate, we will set the next accumulator to be the current one, only enlarged by the current element
*/


// ### 3.3 Implement `some` and `every` using `map` and `reduce`.

/*
    `some(pred)` is a method that returns `true` if and only if *at least one* element in an array satisfies a given predicate.
    
    `every(pred)` is a method that returns true if and only if *all* the elements in an array satisfy a given predicate.
    
    For example:
*/

let even = (x: number): boolean => x % 2 === 0;
let arr1 = [1, 2, 3, 4];
let arr2 = [1, 3, 5, 7];
let arr3 = [2, 4, 6, 8];
let arr1HasEvenNumbers = arr1.some(even);
let arr2HasEvenNumbers = arr2.some(even);
let allInArr1AreEven = arr1.every(even);
let allInArr3AreEven = arr3.every(even);
console.log(`arr1HasEvenNumbers = ${arr1HasEvenNumbers}`);
console.log(`arr2HasEvenNumbers = ${arr2HasEvenNumbers}`);
console.log(`allInArr1AreEven = ${allInArr1AreEven}`);
console.log(`allInArr3AreEven = ${allInArr3AreEven}`);

/*
Instructions: 
    
    A way to implement `some` is by mapping the array to `true/false` values of whether each element satisfies the predicate, 
    and then doing an accumulated logical `or` between the elements using `reduce`, with the initial accumulator equal to `false`.
    Similarly, we can implement `every` in the same way as above, except that we need to use a logical `and` and our initial accumulator should be `true`.
    
*/

// ## Shortcut Semantics

/*
    The native `some` and `every` methods employ a concept known as 'shortcut semantics'. 
    What this means, is that `some` stops and immediately returns `true` at the moment 
    it finds an element that satisfies the predicate. 
    `every` stops and immediately returns `false` at the moment it finds an element that does not satisfy the predicate.
    
    **Question**: does our implementation satisfy shortcut semantics?
    
    It is difficult to distinguish between shortcut semantics and non-shortcut semantics because both shortcut and non-shortcut versions return the same values for all parameters.  
    
    Can we conclude that a shortcut and non-shortcut versions of `some` are equivalent according to the definition of function equivalence we provided in class?
    
    Remember though the difference between mathematical function equivalence and programming functions equivalence: 
    2 programming functions `f` and `g` are equivalent if they have the same domain, same range and for all values in the domain:
    * Either `f(x)` has a value and `g(x)` has the same value
    * Or `f(x)` does not terminate and `g(x)` does not terminate as well
    * Or `f(x)` throws an error and `g(x)` throws an error as well
    
    How can we then distinguish between a shortcut semantics version of `some` and one that is not shortcut?
    
    The solution is to choose parameters that will distinguish between the two computations using either non-termination (infinite loops) or errors.
    
    Let us define such an example on arrays of numbers.  We can trigger an error in Javascript by using the `throw` primitive.
    
    To test whether an error was thrown, we use the same syntax as in Java - with `try/catch`.
*/

const throwOnZero = (x: number) => {
    if (x > 0)
        return true;
    else
        throw false;
};

let a = [1, 0];

try {
    a.some(throwOnZero);
} catch (e) {
    e;
}

const someExercise = (pred: (x: any) => boolean, arr: any[]) =>
    arr.map(pred).reduce((acc, cur) => acc || cur, false);

try {
    someExercise(throwOnZero, a);
} catch (e) {
    e;
}

/*
    By using deliberate error throwing, we are able to distinguish between shortcut and non-shortcut semantics on the definition
    of the `some` function.

    The next question that arises is whether we can define a version of `some` using `reduce` that has shortcut semantics.
    We will revisit this question in Chapter 3 of the course, when we introduce generators.
*/
