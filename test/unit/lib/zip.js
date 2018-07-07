const { expect } = require("chai");

const { zip } = require("../../../src/lib/zip");

describe("zip.js", () => {
  describe("zip()", () => {
    const fixtures = [
      {
        input: [["x", "y", "z"], ["a", "b", "c"]],
        expected: {
          x: "a",
          y: "b",
          z: "c",
        },
        it: "should zip two arrays together into a map as keys and values",
      },
    ].map(fixture =>
      Object.assign(fixture, {
        actual: zip(fixture.input[0])(fixture.input[1]),
      })
    );

    fixtures.forEach(fixture =>
      it(fixture.it, () =>
        expect(fixture.actual).to.deep.equal(fixture.expected)
      )
    );
  });
});
