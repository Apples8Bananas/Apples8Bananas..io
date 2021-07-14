// ---------------------------------------------------------------
// This is how we declare an array containing the elements 16,8,27,13
let a = [16, 8, 27, 13];

// Here's how we use the Array compound value getter:
console.log(a[3]);

// There is also a slice method:
console.log(a.slice(1, 4));

console.log(typeof a);
// ---------------------------------------------------------------

// ---------------------------------------------------------------
console.log(a instanceof Array);

// The array we defined above is **homogeneous**, meaning that it contains a single data type. 
// The **homogeneous** array `a` above contains values whose types are `number`. 
// Arrays in Javascript can be heterogeneous as well: 

let manyArray = [1, 'a', '2', "The Dawn", true];

console.log(`manyArray = ${manyArray}`);
// ---------------------------------------------------------------


// ---------------------------------------------------------------
// Maps and the Object.keys

// Maps are the second basic compound type in Javascript:

// This is how we declare them
let b = [1, 2, 3];
let map = { a: 1, b: 2 };

// This is how we use the Map compound value getter for the values:
console.log(map['a']);
console.log(map.a);
console.log(map['b']);
console.log(map.b);

// And for keys (relevant for both Arrays [the keys there are the indexes] and Maps)
console.log(Object.keys(b));
console.log(Object.keys(map));
// ---------------------------------------------------------------

// 2. JSON

// 2.1 JSON Review

// JSON stands for Java Script Object Notation and is a standard way to serialize JavaScript compound values into strings (and vice-versa). 
// It is widely used to allow data exchange in server-client communication. It serves a role that is similar to XML.
// JSON is a **notation** - that is, a way of writing Javascript values in a way that allows reading them back easily. 
// Most JavaScript values can be written in JSON - but not all of them.

// Once you have a JavaScript object, and once there is an agreed-upon-way of "stringifying" the object 
// (in our case, the standard way is `JSON.stringify()`), then you can easily pass this string through the network, 
// from a computer to a computer, as passing strings through the network is easy, 
// and the receiving side can only do an agreed-upon way to parse the string into an object (in our case, the standard way is `JSON.parse()`).

// The JSON interface defines the following two methods: 
// 1. `JSON.stringify(o)` - maps a value to a string
// 2. `JSON.parse(s)` - maps a string written according to the JSON syntax to a value
// JSON serves a similar goal to that of `Serializable` of Java studied in SPL.


// ---------------------------------------------------------------
let person1 = { name: "Yosi", age: 31, city: "Beer Sheva" };
let person1JSONString = JSON.stringify(person1);

console.log(`person1 serialized in JSON = ${person1JSONString}`);
console.log(`person1JSONString is of type ${typeof person1JSONString}`);

let person2 = JSON.parse(person1JSONString);

console.log(person2);
console.log(`person2 is of type ${typeof person2}`);
// ---------------------------------------------------------------


// ---------------------------------------------------------------
// Note that the way values are written in JSON is not exactly the same as we write them in a JavaScript program 
// - there are quotes ("") around keys for example.
// Note also that `stringify()` and `parse()` work on atomic values as well:

// note that the input to JSON.parse is a JSON string
console.log(typeof (JSON.parse('2')));
console.log(typeof (JSON.parse('true')));
console.log(typeof (JSON.parse('"abc"')));
// ---------------------------------------------------------------

// The values that can be encoded into JSON (let us call them "JSON values") must be one of the following types:
// 1. string
// 2. number
// 3. boolean
// 4. null
// 5. a map where all the keys are strings and all the values are JSON values (recursively) 
// 6. an array where all the values are JSON values

// The JavaScript compound data types, *arrays* and *maps*, can be combined in a recursive manner. 
// This applies to JSON as well.

// The JavaScript values that **cannot be encoded** into JSON strings are `undefined` and functions.

// Let us look at an example of a complex value and how we can describe it in JSON and 
// then how using types can help us describe its structure in a well-documented manner:


// ---------------------------------------------------------------
let studentsData = {
    department: "Computer Science",
    students: [
        { name: "Alice", degree: "PhD" },
        { name: "Bob", degree: "MSc" }
    ]
};

let studentsJSON = JSON.stringify(studentsData);

console.log(studentsJSON);
console.log(`studentsJSON is of type ${typeof studentsJSON}`);
let studentsJSONParsed = JSON.parse(studentsJSON);
console.log(studentsJSONParsed);
console.log(`studentsJSONParsed is of type ${typeof studentsJSONParsed}`);


// We verified that this complex structure can be written into JSON, 
// and then parsed back into an identical value (this is a **round-trip** that preserves the value).
// ---------------------------------------------------------------
