const { expect } = require("chai");
const { spy } = require("sinon");
const uuid = require("uuid");
const bluebird = require("bluebird");
const nativePromiseOnly = require("native-promise-only");
const RSVP = require("rsvp").Promise;

const { promisify } = require("../../src/promisify");

describe("promise_util.js", () => {
  describe("promisify,", () => {
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

    const createPassMockFn = () => createMockFn(undefined, passingUuid);
    const createFailMockFn = () => createMockFn(errorUuid, undefined);

    const promiseLibs = [undefined, bluebird, nativePromiseOnly, RSVP];

    const testFn = (numberOfArguments, promiseLibrary) => (mockFn, expected) => {
      const args = new Array(numberOfArguments).map(() => uuid());

      const isCustomPromise = promiseLibrary !== undefined && promiseLibrary !== null;
      let promiseLibrarySpy;

      let promisifyTest;
      if (isCustomPromise) {
        promiseLibrarySpy = spy(promiseLibrary);
        promisifyTest = promisify(mockFn, promiseLibrarySpy);
      } else {
        promisifyTest = promisify(mockFn);
      }

      return promisifyTest(...args)
        .then(actual => {
          expect(actual).to.deep.equal(expected);

          expect(fnSpy.calledOnce).to.be.true;

          const actuallyExpected = fnSpy.args[0].slice(
            0,
            fnSpy.args[0].length - 1
          );

          if (isCustomPromise) {
            expect(promiseLibrarySpy.called).to.be.true;
          } else {
            expect([actuallyExpected]).to.deep.equal([args]);
          }
        })
        .catch(actual => {
          expect(actual).to.deep.equal(expected);
        });
    };

    promiseLibs.forEach((promiseLib, index) => {
      describe(`when using ${index < 1 ? 'native Promises,' : 'Promise library ' + index + ','}`, () => {
        it("should promise to execute a standard callback function with a 0 argument signature like (callback)", () => {
          return testFn(0, promiseLib)(createPassMockFn(), passingUuid);
        });

        it("should promise to execute a standard callback function with a 1 argument signature like (a, callback)", () => {
          return testFn(1, promiseLib)(createPassMockFn(), passingUuid);
        });

        it("should promise to execute a standard callback function with a 2 argument signature like (a, b, callback)", () => {
          return testFn(2, promiseLib)(createPassMockFn(), passingUuid);
        });

        it("should promise to execute a standard callback function with a 10 argument signature like (a, b, c, d, e, f, g, h, i, j, callback)", () => {
          return testFn(10, promiseLib)(createPassMockFn(), passingUuid);
        });

        it("should reject if called back with an error", () => {
          return testFn(10, promiseLib)(createFailMockFn(), errorUuid);
        });
      });
    });
  });
});
