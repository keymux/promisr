const { expect } = require("chai");

const { spy } = require("sinon");
const uuid = require("uuid");

const { promisify } = require("../../src/promisify");

describe("promise_util.js", () => {
  describe("promisify", () => {
    let passingUuid;
    let errorUuid;
    let fnSpy;

    beforeEach(() => {
      passingUuid = uuid();
      errorUuid = uuid();
      fnSpy = spy();
    });

    const createMockFn = (error, result) => (...mockFnArgs) => {
      fnSpy(...mockFnArgs);

      mockFnArgs[mockFnArgs.length - 1](error, result);
    };

    const testFn = numberOfArguments => (mockFn, expected) => {
      const args = Array.from(Array(numberOfArguments)).map(() => uuid());

      return promisify(mockFn)(...args)
        .then(actual => {
          expect(actual).to.deep.equal(expected);

          expect(fnSpy.calledOnce).to.be.true;

          const actuallyExpected = fnSpy.args[0].slice(
            0,
            fnSpy.args[0].length - 1
          );

          expect([actuallyExpected]).to.deep.equal([args]);
        })
        .catch(actual => {
          expect(actual).to.deep.equal(expected);
        });
    };

    const createPassMockFn = () => createMockFn(undefined, passingUuid);
    const createFailMockFn = () => createMockFn(errorUuid, undefined);

    it("should promise to execute a standard callback function with a 0 argument signature like (callback)", () => {
      return testFn(0)(createPassMockFn(), passingUuid);
    });

    it("should promise to execute a standard callback function with a 1 argument signature like (a, callback)", () => {
      return testFn(1)(createPassMockFn(), passingUuid);
    });

    it("should promise to execute a standard callback function with a 2 argument signature like (a, b, callback)", () => {
      return testFn(2)(createPassMockFn(), passingUuid);
    });

    it("should promise to execute a standard callback function with a 10 argument signature like (a, b, c, d, e, f, g, h, i, j, callback)", () => {
      return testFn(10)(createPassMockFn(), passingUuid);
    });

    it("should reject if a called back with an error", () => {
      return testFn(10)(createFailMockFn(), errorUuid);
    });
  });
});
