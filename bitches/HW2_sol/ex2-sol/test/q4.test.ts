import { parseL3, parseL3Exp } from '../imp/L3-ast';
import { l2ToPython } from '../src/q4';
import { bind, Result, makeOk,mapResult } from '../shared/result';
import { expect } from 'chai';
import { parse as p } from "../shared/parser";
import { strict } from 'node:assert';

const l2ToPythonResult = (x: string): Result<string> =>
    bind(bind(p(x),parseL3Exp),l2ToPython);

const replaceAll = function (str:string,find:string,rep:string):string {
    let  strLen:number =str.length;
    for(var i = 0 ; i <strLen ;i++){
        str = str.replace(find,rep);
    }
    return str

}
const fit = function (str:string):string {

    let strShort:string = replaceAll(str , " " ,"");
    strShort = replaceAll(strShort, "(" ,"");
    strShort = replaceAll(strShort, ")" ,"");
    return strShort;

    }

// const dist = 2

// const LevenshteinDistance = function (a:String,b:String):number {
//     if (a.length === 0){
//         return b.length;
//     } 
//     if (b.length === 0){
//         return a.length;
//     } 
//     if(a.charAt(0) == b.charAt(0)){
//         return LevenshteinDistance(a.substr(1),b.substr(1))
//     }

//     return 1 + Math.min(
//         LevenshteinDistance(a,b.substr(1)),
//         LevenshteinDistance(a.substr(1),b),
//             LevenshteinDistance(a.substr(1),b.substr(1))     
//     )

    
//     }
describe('Q4 Tests', () => {

     it('parse primitive ops', () => {
         expect(l2ToPythonResult(`(+ 3 5 7)`)).to.deep.equal(makeOk(`(3 + 5 + 7)`));
         expect(l2ToPythonResult(`(= 3 (+ 1 2))`)).to.deep.equal(makeOk(`(3 == (1 + 2))`));
     });

     it('parse "if" expressions', () => {
         expect(l2ToPythonResult(`(if (> x 3) 4 5)`)).to.deep.equal(makeOk(`(4 if (x > 3) else 5)`));

        });

     it('parse "lambda" expressions', () => {
         expect(l2ToPythonResult(`(lambda (x y) (* x y))`)).to.deep.equal(makeOk(`(lambda x,y : (x * y))`));
         expect(l2ToPythonResult(`((lambda (x y) (* x y)) 3 4)`)).to.deep.equal(makeOk(`(lambda x,y : (x * y))(3,4)`));
         expect(l2ToPythonResult(`(lambda (x) (eq? x 5))`)).to.deep.equal(makeOk(`(lambda x : (x == 5))`));
         expect(l2ToPythonResult(`(lambda () 5 )`)).to.deep.equal(makeOk(`(lambda  : 5)`));

        });
    
    it("define constants", () => {
         expect(l2ToPythonResult(`(define pi 3.14)`)).to.deep.equal(makeOk(`pi = 3.14`));
    });

    it("define functions", () => {
        expect(l2ToPythonResult(`(define f (lambda (x y) (* x y)))`)).to.deep.equal(makeOk(`f = (lambda x,y : (x * y))`));
        expect(l2ToPythonResult(`(define g (lambda () (+ 1 2)))`)).to.deep.equal(makeOk(`g = (lambda  : (1 + 2))`));
        expect(l2ToPythonResult(`(define h (lambda (x y) (if (< x y) x y)))`)).to.deep.equal(makeOk(`h = (lambda x,y : (x if (x < y) else y))`));

    });

    it("apply user-defined functions", () => {
        expect(l2ToPythonResult(`(f 3 4)`)).to.deep.equal(makeOk(`f(3,4)`));
        expect(l2ToPythonResult(`(g )`)).to.deep.equal(makeOk(`g()`));

    });

   it('program', () => {
        expect(bind(parseL3(`(L3 (define b (> 3 4)) (define x 5) (define f (lambda (y) (+ x y))) (define g (lambda (y) (* x y))) (if (not b) (f 3) (g 4)) (if (= a b) (f 3) (g 4)) (if (> a b) (f 3) (g 4)) ((lambda (x) (* x x)) 7))`), l2ToPython)).to.deep.equal(makeOk(`b = (3 > 4)\nx = 5\nf = (lambda y : (x + y))\ng = (lambda y : (x * y))\n(f(3) if (not b) else g(4))\n(f(3) if (a == b) else g(4))\n(f(3) if (a > b) else g(4))\n(lambda x : (x * x))(7)`));
    });

    it('types', () => {


        let res = mapResult((x) => l2ToPythonResult(x),[`boolean?`]);
        if(res['tag'] == 'Ok'){
            let str:string = fit(res['value'][0]);
            try{
                expect(str).to.deep.equal("lambdax:typex==bool");
            }
            catch(error){
                expect(l2ToPythonResult(`boolean?`)).to.deep.equal(makeOk(`(lambda x : (type(x) == bool))`));
            }
            
        }
        else{
            expect(l2ToPythonResult(`boolean?`)).to.deep.equal(makeOk(`(lambda x : (type(x) == bool))`));

        }
 
    });
});