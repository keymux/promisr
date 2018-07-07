const { expect } = require("chai");

const uuid = require("uuid");

const { promiseMap } = require("../../src/promise_map");

describe("promise_map.js", () => {
  describe("promise_map()", () => {
    const inputArray = Array.apply(null, Array(10)).map(() => uuid());
    const input = inputArray.reduce(
      (a, v, i) => Object.assign(a, { [i]: v }),
      {}
    );

    const fixtures = [
      {
        input: {},
        expected: {},
        it: "should not barf on no items",
      },
      {
        input,
        expected: input,
        it:
          "should promise to resolve the resolved map with only static values",
      },
      {
        input: Object.assign({}, input, {
          "4": Promise.resolve(inputArray[4]),
        }),
        expected: input,
        it:
          "should promise to resolve the resolved map with a mix of promises and static values",
      },
      {
        input: {
          a: 3,
          b: Promise.resolve(4),
          c: 5,
        },
        expected: {
          a: 3,
          b: 4,
          c: 5,
        },
        it:
          "should promise to resolve the resolved map with a mix of promises and static values",
      },
      {
        input: {
          a: Promise.resolve(7),
          z: Promise.resolve(26),
        },
        expected: {
          a: 7,
          z: 26,
        },
        it: "should promise to resolve the resolved map with only promises",
      },
    ].map(fixture =>
      Object.assign(fixture, {
        promiseActual: promiseMap(fixture.input),
      })
    );

    fixtures.forEach(fixture =>
      it(fixture.it, () =>
        fixture.promiseActual.then(actual =>
          expect(actual).to.deep.equal(fixture.expected)
        )
      )
    );
  });
});
