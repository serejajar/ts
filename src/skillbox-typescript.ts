// Задание 1
type HelloWorld = string // expected to be a string

import type { Equal, Expect, NotAny } from '@type-challenges/utils'

/* _____________ Test Cases _____________ */

type cases = [
  Expect<NotAny<HelloWorld>>,
  Expect<Equal<HelloWorld, string>>,
]

// Задание 2
type First<T extends any[]> = T extends [] ? never : T[0]

/* _____________ Test Cases _____________ */
type cases = [
  Expect<Equal<First<[3, 2, 1]>, 3>>,
  Expect<Equal<First<[() => 123, { a: string }]>, () => 123>>,
  Expect<Equal<First<[]>, never>>,
  Expect<Equal<First<[undefined]>, undefined>>,
]

type errors = [
  // @ts-expect-error
  First<'notArray'>,
  // @ts-expect-error
  First<{ 0: 'arrayLike' }>,
]

// Задание 3
type Flatten<S extends any[], T extends any[] = []> =  S extends [infer X, ...infer Y] ?
  X extends any[] ?
    Flatten<[...X, ...Y], T> : Flatten<[...Y], [...T, X]>
  : T

/* _____________ Test Cases _____________ */
type cases = [
  Expect<Equal<Flatten<[]>, []>>,
  Expect<Equal<Flatten<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<Flatten<[1, [2]]>, [1, 2]>>,
  Expect<Equal<Flatten<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, 5]>>,
  Expect<Equal<Flatten<[{ foo: 'bar', 2: 10 }, 'foobar']>, [{ foo: 'bar', 2: 10 }, 'foobar']>>,
]

// @ts-expect-error
type error = Flatten<'1'>

// Задание 4
type RemoveIndexSignature<T, P=PropertyKey> = {
  [K in keyof T as P extends K? never : K extends P ? K : never]: T[K]
}

type Foo = {
  [key: string]: any
  foo(): void
}

type Bar = {
  [key: number]: any
  bar(): void
  0: string
}

const foobar = Symbol('foobar')
type FooBar = {
  [key: symbol]: any
  [foobar](): void
}

type Baz = {
  bar(): void
  baz: string
}

/* _____________ Test Cases _____________ */
type cases = [
  Expect<Equal<RemoveIndexSignature<Foo>, { foo(): void }>>,
  Expect<Equal<RemoveIndexSignature<Bar>, { bar(): void, 0: string }>>,
  Expect<Equal<RemoveIndexSignature<FooBar>, { [foobar](): void }>>,
  Expect<Equal<RemoveIndexSignature<Baz>, { bar(): void, baz: string }>>,
]


// Задание 5
type Diff<O, O1> = Omit<O & O1, keyof (O | O1)>


/* _____________ Test Cases _____________ */
type Foo2 = {
  name: string
  age: string
}
type Bar2 = {
  name: string
  age: string
  gender: number
}
type Coo = {
  name: string
  gender: number
}

type cases = [
  Expect<Equal<Diff<Foo2, Bar2>, { gender: number }>>,
  Expect<Equal<Diff<Bar2, Foo2>, { gender: number }>>,
  Expect<Equal<Diff<Foo2, Coo>, { age: string, gender: number }>>,
  Expect<Equal<Diff<Coo, Foo2>, { age: string, gender: number }>>,
]
