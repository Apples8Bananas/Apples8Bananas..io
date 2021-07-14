import { expect } from 'chai';
import { unparseL31, parseL31, parseL31Exp } from '../src/L31-ast';
import { L31ToL3 } from '../src/q3';
import { makeOk, bind, isFailure } from '../shared/result';
import { parse as p } from "../shared/parser";

describe('Q3 Tests', () => {
     it('test parse/unparse pair class', () => {
          expect(bind(bind(p(`(class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))`),parseL31Exp), x=>makeOk(unparseL31(x)))).to.deep.equal(makeOk(`(class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))`));
         });

     it('test parse wrong class1', () => {
          expect(bind(p(`(class ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))`),parseL31Exp)).is.satisfy(isFailure);
     });

     it('test parse wrong class2', () => {
          expect(bind(p(`(class (a b) (sum (lambda () (+ a b)))))`),parseL31Exp)).is.satisfy(isFailure);
     });

     it('test parse/unparse pair program', () => {
          expect(bind(parseL31(`(L31 (define pair (class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))) (let ((p12 (pair 1 2)) (p34 (pair 3 4))) (if (> (p12 'first) (p34 'second)) #t #f)))`), x=>makeOk(unparseL31(x)))).to.deep.equal(makeOk(`(L31 (define pair (class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))) (let ((p12 (pair 1 2)) (p34 (pair 3 4))) (if (> (p12 'first) (p34 'second)) #t #f)))`));
         });

     it('test parse/unparse bool program', () => {
     expect(bind(parseL31(`(L31 (define not (class (a) ((var (lambda () a)) (op (lambda () (not a)))))) (let ((p#f (not #f)) (p#t (not #t))) (if (eq? (p#f 'var) (p#t 'var)) #t #f)))`), x=>makeOk(unparseL31(x)))).to.deep.equal(makeOk(`(L31 (define not (class (a) ((var (lambda () a)) (op (lambda () (not a)))))) (let ((p#f (not #f)) (p#t (not #t))) (if (eq? (p#f 'var) (p#t 'var)) #t #f)))`));
     });
     
     it('trnasform pair class-exp in to proc-exp', () => {
          expect(bind(bind(bind(p(`(class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))`), parseL31Exp), L31ToL3),  x=>makeOk(unparseL31(x)))).to.deep.equal(makeOk(`(lambda (a b) (lambda (msg) (if (eq? msg 'first) ((lambda () a) ) (if (eq? msg 'second) ((lambda () b) ) (if (eq? msg 'sum) ((lambda () (+ a b)) ) #f)))))`));
     });

     it('trnasform pair class-exp program in to proc-exp', () => {
          expect(bind(bind(parseL31(`(L31 (define pair (class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))) (let ((p12 (pair 1 2)) (p34 (pair 3 4))) (if (> (p12 'first) (p34 'second)) #t #f)))`), L31ToL3),  x=>makeOk(unparseL31(x)))).to.deep.equal(makeOk(`(L31 (define pair (lambda (a b) (lambda (msg) (if (eq? msg 'first) ((lambda () a) ) (if (eq? msg 'second) ((lambda () b) ) (if (eq? msg 'sum) ((lambda () (+ a b)) ) #f)))))) (let ((p12 (pair 1 2)) (p34 (pair 3 4))) (if (> (p12 'first) (p34 'second)) #t #f)))`));
     });
     
     it('trnasform bool class-exp program in to proc-exp', () => {
          expect(bind(bind(parseL31(`(L31 (define not (class (a) ((var (lambda () a)) (op (lambda () (not a)))))) (let ((p#f (not #f)) (p#t (not #t))) (if (eq? (p#f 'var) (p#t 'var)) #t #f)))`), L31ToL3),  x=>makeOk(unparseL31(x)))).to.deep.equal(makeOk(`(L31 (define not (lambda (a) (lambda (msg) (if (eq? msg 'var) ((lambda () a) ) (if (eq? msg 'op) ((lambda () (not a)) ) #f))))) (let ((p#f (not #f)) (p#t (not #t))) (if (eq? (p#f 'var) (p#t 'var)) #t #f)))`));
     });
});