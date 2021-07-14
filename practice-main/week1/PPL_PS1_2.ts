// PPL_PS1_2.ts

// ---------------------------------------------------------------
// 2.1 Variable Types

// JavaScript is a *dynamic language*, meaning that variables are not typed. 
// But when a variable is bound to a value, we can inspect its type at runtime. 

// TypeScript extends JavaScript to introduce optional variable types - it is compiled into JavaScript 
// and at compilation time, type checking is performed. Let's recall the example from the lectures: 

let typedVarNum: number = 6;
let typedVarStr: string = "blue";
let typedVarBool: boolean = true;


// ---------------------------------------------------------------
// 2.2 Documenting Complex Values with Type Annotations

// Use the interface TypeScript construct to name map compound types:
interface Student {
    name: string;
    degree: string;
}

interface StudentsData {
    department: string;
    students: Student[];
}

// This type definition is useful to document the type of the expected values that we expect to read.

// ---------------------------------------------------------------
// 2.3 Working on complex JSON values

// Use the methods **map,filter,reduce** to operate over complex JSON values. 
// We will take a videos-database example (http://reactivex.io/learnrx/) as a basis for our examples.

// Suppose you are a developer at the popular streaming-movie website Netflix, 
// and that your system's *API* uses JSON to communicate data.  
// The JSON values we describe are actual JSON values returned by the Netflix API.
// When searching for new movie releases, you send a query to the API, and obtain a JSON reply:

let newReleases = [
    {
        "id": 70111470,
        "title": "Die Hard",
        "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard.jpg",
        "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 4.0,
        "bookmark": []
    },
    {
        "id": 654356453,
        "title": "Bad Boys",
        "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys.jpg",
        "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 5.0,
        "bookmark": [{ id: 432534, time: 65876586 }]
    },
    {
        "id": 65432445,
        "title": "The Chamber",
        "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber.jpg",
        "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 4.0,
        "bookmark": []
    },
    {
        "id": 675465,
        "title": "Fracture",
        "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture.jpg",
        "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
        "rating": 5.0,
        "bookmark": [{ id: 432534, time: 65876586 }]
    }
];

// Let us describe the **type** of this value:
// * We observe it is a homogeneous array of map values.
// * Each map value describes a "movie" with fields id, title, boxart, uri, rating and bookmark.
// The corresponding TypeScript annotation is:

interface Video {
    id: number;
    title: string;
    boxart: string;
    uri: string;
    rating: number;
    bookmark: { id: number, time: number }[];
}
type Releases = Video[];

// This type annotation lets us think about the data we obtained from the API as an array
// `[v1, v2, v3, v4]` where each item $v_i$ is a map `{id, title, boxart, uri, rating, bookmark}`.

// Note: while *interface* actually introduces a new type, *type* only provides an alias and not a new type. 
// For instance, alias names will not be used in error messages. In addition, unlike an interface, one can give a type alias to any type annotation.

// 2.3.1 Map over an Array of Videos

// We would like to transform this data into an array of `{id,title}` properties. 
// This transformation is called a **projection** as we select only some of the properties in the input. 
// In terms of types, this transformation maps from the type `Video[]` into the type `{id:number, title:string}[]`.

// A procedural way to achieve this goal would be:

function getIDsAndTitles_1(reply: Releases) {
    let res = [];
    for (let i = 0; i < reply.length; i++) {
        res.push({ id: reply[i].id, title: reply[i].title });
    }
    return res;
}

let newReleasesIDAndTitle1 = getIDsAndTitles_1(newReleases);
console.log(newReleasesIDAndTitle1)

// A functional way of achieving the same result uses the **map** method (seen in the reading material for week-1) 
// to abstract away the loop and the mutations we observe in the procedural solution (`i++, res.push()`).
let newReleasesIDAndTitle2 = newReleases.map(x => ({ id: x.id, title: x.title }));
console.log(newReleasesIDAndTitle2)

// Note that in this version:
// * There is no loop (`map` abstracts away the loop control structure)
// * There is no variable assignment (no need to define a loop counter `i` and mutate it and to maintain a `res` accumulator variable).

// What is the type of the transformer function we pass as an argument to `map()`?
// it gets as an argument `x` an item from newReleases - which is of type `Video` - and it returns a map of type `{id:number, name:title}`.  


// 2.3.2 Filter an Array of Videos

// The user would like to search for new releases that have a rating of 5.0 only.  
// We can solve this problem using **filter**.

// In terms of types, the operation we want to define maps an array of `Video[]` to an array of `Video[]`.
// This fits the definition of `filter` - which does not change the type of items in the array.
let newReleasesOfRating5 = newReleases.filter(x => x.rating === 5);
console.log(newReleasesOfRating5);
// ---------------------------------------------------------------


// ---------------------------------------------------------------
// 2.3.4 Reminder: Reduce and Neutral Elements as Initializers

// Compare the following 5 invocations of `reduce`:

// Compute the sum of an array of integers
console.log([1, 2, 3].reduce((acc, cur) => acc + cur, 0));

// Compute the product of an array of integers
console.log([1, 2, 3].reduce((acc, cur) => acc * cur, 1));

// Compute the logical and of an array of booleans
console.log([true, false, true].reduce((acc, cur) => acc && cur, true));

// Compute the logical or of an array of booleans
console.log([true, false, true].reduce((acc, cur) => acc || cur, false));

// Compute the max of an array of numbers
console.log([3, 1, 4].reduce((acc, cur) => Math.max(acc, cur), 0));

// Note that in all 5 cases, the initializer passed to `reduce(reducer,init)` 
// is the neutral element of the reducer operator
// (0 for `+`, 1 for `*`, `true` for `and`, `false` for `or`).

// This makes sense in general - and allows one to answer the puzzling question of 
// **what should be the value of reduce when applied to an empty array**.  
// The general answer is that it should be the neutral element of the reducer.

// **NOTE**: the `max` version takes as an initializer the value 0.  
// This is not correct when the array can contain negative numbers.  What should be the initial value in this case?
// ---------------------------------------------------------------



// ---------------------------------------------------------------
// 2.3.5 Rectangle Selection with Reduce

// A user has chosen to view movies as boxarts (that is, the image that is shown for each movie), 
// as it is easier to select movies according to their boxarts. 
// The API returned the following value as a reply to our query:

let boxarts = [
    { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
    { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
    { width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" },
    { width: 425, height: 150, url: "http://cdn-0.nflximg.com/images/2891/Fracture425.jpg" }
];


// Let us define the type of this returned value: it is a homogeneous array of maps.
// Each map describes a boxart.
interface Boxart {
    width: number;
    height: number;
    url: string;
}

// We would like to find the largest box-art image size, 
// so that we could know what is the maximal size of the image placeholder should be.  
// We measure rectangles by their area ($width \times height$).

// A straightforward way to do this is by going over each boxart, 
// and keeping a temporary variable that holds the largest size out of the boxarts we have seen so far.

// In terms of types, the transformation maps an array `Boxart[]` into a `number`. 
// Let us annotate this type into the function definition:

interface Boxart {
    width: number;
    height: number;
    url: string;
};

function maxBox(boxes: Boxart[]): number {
    let maxBox = 0;
    for (let i = 0; i < boxes.length; i++) {
        let curBoxSize = boxes[i].width * boxes[i].height;
        if (curBoxSize > maxBox) {
            maxBox = curBoxSize;
        }
    }
    return maxBox;
}
console.log(`maxBox(boxarts) = ${maxBox(boxarts)}`);

// This is a case of a loop to accumulate a value from an array of values. 
// In terms of types, it maps an array to a single value. 
// The **reduce** method fits perfectly for this scenario: 
// The `reduce` method takes as parameter a reducer function and an initial value, and returns the accumulated value. 

// The reducer function takes two arguments: 
// * the current accumulator, 
// * and the current item. 
// The return value of the reducer function is the "successive" value of the accumulator parameter. 
// That is, the result of some operation applied to the current accumulator, and the current item.

// Our current accumulator should be the current largest box-art image size, and the initial value should be 0.

let largestBoxartSize = boxarts.reduce(
    (curMax, curBox) => {
        let curBoxSize = curBox.width * curBox.height;
        if (curBoxSize > curMax) {
            return curBoxSize;
        } else {
            return curMax;
        }
    }, // this is the reducer function
    0 // this is the initial value
);

console.log(`largestBoxartSize = ${largestBoxartSize}`);

// Note that this version has no side effect, no mutation and no loop.

// We can make this version more readable by using the Math.max function - to express clearly that what we are doing in this 
// `reduce` invocation is the identification of the max of an array.  We also annotate the expected type of the parameters in the reducer.

const boxSize = (box: Boxart) => box.width * box.height;
let maxBoxSize = boxarts.reduce((curMax: number, curBox: Boxart) => Math.max(curMax, boxSize(curBox)), 0);

console.log(`maxBoxSize = ${maxBoxSize}`);
// ---------------------------------------------------------------




// ---------------------------------------------------------------
// 2.4 Tree Values

// Some replies will be more complex than what we have witnessed above: 
// it is very often that we face replies that have a **tree** form, as opposed to a flat homogeneous array. 
// One example of such, is the following API reply - which returns values grouped by movie genre ("New Releases", "Dramas" ...)

let movieLists = [
    {
        name: "New Releases",
        videos: [
            {
                "id": 70111470,
                "title": "Die Hard",
                "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard.jpg",
                "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                "rating": 4.0,
                "bookmark": []
            },
            {
                "id": 654356453,
                "title": "Bad Boys",
                "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys.jpg",
                "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                "rating": 5.0,
                "bookmark": [{ id: 432534, time: 65876586 }]
            }
        ]
    },
    {
        name: "Dramas",
        videos: [
            {
                "id": 65432445,
                "title": "The Chamber",
                "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber.jpg",
                "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                "rating": 4.0,
                "bookmark": []
            },
            {
                "id": 675465,
                "title": "Fracture",
                "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture.jpg",
                "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                "rating": 5.0,
                "bookmark": [{ id: 432534, time: 65876586 }]
            }
        ]
    }
];

/*
To document the structure of this value, let us write its type:
* It is an array of 2 maps of identical structure.
* Each item represents a category of Videos. The category maps have the following keys:
    * name: string 
    * videos: an array of Video[].

The Typescript definition is thus:
*/

interface VideoCategory {
    name: string;
    videos: Video[];
}
type VideoCategories = VideoCategory[];

/*
    The structure of the value is thus a *tree*:
    $[ category_1, category_2 ]$
    where 
    $category_i$ is of the form:
    `{name:string, videos:[v1,...]}`.
    
    These kinds of trees impose a challenge when working with them: if we apply `map` or `filter`, the transformer or the predicate will receive as argument a `VideoCategory` object.  If we want to process the embedded `Video` objects inside the categories, we must first **flatten** the tree.
    
    Suppose we would like to have a list of all movie ids in that tree. The most trivial way, as before, is to do the following (using a foreach loop):
*/

let movieIds: number[] = [];
movieLists.forEach(category => category.videos.forEach(video => movieIds.push(video.id)));
console.log(`movieIds=${movieIds}`);

/*
    `forEach()` abstracts a single loop.  The embedded calls to `forEach` inside `forEach` reflects the two-level traversal of the tree.
    
    Note that `forEach()` is **not a functional** style: this is precisely the type of operations we want to abstract away using map/filter/reduce. This version has an accumulator variable (`movieIds`) which we must initialize and then mutate as part of the `forEach` iteration.
    
    Not a functional solution...
    
    The general feeling of the task we want to perform is an **accumulation** - so that `reduce` seems to be the good tool.
    But we cannot apply `reduce()` as is, because `reduce` would work on `Category` values and we want to accumulate `Video` values.
    
    Alternatively, we could attempt to use **map** as we are mapping `Video` values into `number` values.  But again, we cannot map over Categories - we need to map over Videos - so that `map` cannot be used directly.
    
    Let's recall the concat() method of arrays:
*/

// ---------------------------------------------------------------
let arrayOne = [1, 2, 3, 4];
let arrayTwo = [5, 6, 7, 8];
console.log(`arrayOne.concat(arrayTwo) = ${arrayOne.concat(arrayTwo)}`);
// ---------------------------------------------------------------

/*
    In contrast to `push()`, `concat()` does not mutate its arguments - it returns a new array and can be used safely.
    
    If we `reduce` an array of arrays and accumulate using the `concat` operator,  we will get a method that flattens one level of an array of arrays:
*/

// ---------------------------------------------------------------
let a2 = [[1, 2, 3], [4, 5, 6]];
console.log(`a2.reduce((acc, curr) => acc.concat(curr), []) = ${a2.reduce((acc, curr) => acc.concat(curr), [])}`);
// ---------------------------------------------------------------

// We now need to apply a mixture of `map` and `reduce` in order to map and flatten:

// ---------------------------------------------------------------
// We want the following as an array of the numbers:
let a3 = [{ group: 1, numbers: [1, 2, 3] }, { group: 2, numbers: [4, 5, 6] }];
let flattened = a3.map(x => x.numbers).reduce((acc, curr) => acc.concat(curr), []);
console.log(`a3.map(x => x.numbers).reduce((acc,curr) => acc.concat(curr), []) = ${flattened}`);
// ---------------------------------------------------------------


// ---------------------------------------------------------------
// 2.4.1 The 'ramda' package

/*
    'ramda' is a library of functions designed tofacilitate functional programming in JavaScript.
    
    ramda includes a function called `chain()` (often also called `flatmap()`) which can come handy in our last example: If we want to return all of the results as a single flat array instead of as an array of arrays, then we can use `ramda`'s chain:
*/

// ---------------------------------------------------------------
import * as R from "ramda";
let a4 = [{ group: 1, numbers: [1, 2, 3] }, { group: 2, numbers: [4, 5, 6] }];
console.log(`R.chain(x => x.numbers, a4) = ${R.chain(x => x.numbers, a4)}`);

/*      
    The `chain()` function goes through an array, and flattens the result of 'doing something' (which can be 'nothing' or applying a 'mapping') by one level.
    Back to our videos example, if we `chain` the `movieLists` with a function that just returns the category videos, 
    then the result would be an array containing the videos. As such:
*/
let movieLists2 = [
    {
        name: "New Releases",
        videos: [
            {
                "id": 70111470,
                "title": "Die Hard",
                "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard.jpg",
                "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                "rating": 4.0,
                "bookmark": []
            },
            {
                "id": 654356453,
                "title": "Bad Boys",
                "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys.jpg",
                "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                "rating": 5.0,
                "bookmark": [{ id: 432534, time: 65876586 }]
            }
        ]
    },
    {
        name: "Dramas",
        videos: [
            {
                "id": 65432445,
                "title": "The Chamber",
                "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber.jpg",
                "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                "rating": 4.0,
                "bookmark": []
            },
            {
                "id": 675465,
                "title": "Fracture",
                "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture.jpg",
                "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
                "rating": 5.0,
                "bookmark": [{ id: 432534, time: 65876586 }]
            }
        ]
    }
];
let flattenedVideos = R.chain(category => category.videos, movieLists2);
console.log(`R.chain(category => category.videos, movieLists2) = ${flattenedVideos}`);

/*
    The only change that is left, is that we do not want the category videos flattened, 
    rather something extra: taking the category.videos and mapping each element there to its id.
*/
let videoIds = R.chain(category => category.videos, movieLists2).map(video => video.id);
console.log(`R.chain(category => category.videos, movieLists2).map(video => video.id) = ${videoIds}`);
// ---------------------------------------------------------------

// It helps to annotate the types of the arguments in such chained transformations to document and verify their correctness:
console.log(R.chain((category: VideoCategory) => category.videos, movieLists2).map((video: Video) => video.id));
