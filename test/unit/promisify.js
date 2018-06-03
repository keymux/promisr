const { expect } = require("chai");
const { spy } = require("sinon");
const uuid = require("uuid");
const bluebird = require("bluebird");
const nativePromiseOnly = require("native-promise-only");

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

    const nativePromiseCallSet = [0,1,2,10,10];

    const testFn = (numberOfArguments, promiseLibrary) => (mockFn, expected) => {
      const args = new Array(numberOfArguments).map(() => uuid());

      const isCustomPromise = !!promiseLibrary;
      let promiseLibrarySpy;

      let promisifyTest;
      if (promiseLibrary !== undefined && promiseLibrary !== null) {
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

    const testBattery = (callSet) => {
      it("should promise to execute a standard callback function with a 0 argument signature like (callback)", () => {
        return callSet.pop()(createPassMockFn(), passingUuid);
      });

      it("should promise to execute a standard callback function with a 1 argument signature like (a, callback)", () => {
        return callSet.pop()(createPassMockFn(), passingUuid);
      });

      it("should promise to execute a standard callback function with a 2 argument signature like (a, b, callback)", () => {
        return callSet.pop()(createPassMockFn(), passingUuid);
      });

      it("should promise to execute a standard callback function with a 10 argument signature like (a, b, c, d, e, f, g, h, i, j, callback)", () => {
        return callSet.pop()(createPassMockFn(), passingUuid);
      });

      it("should reject if called back with an error", () => {
        return callSet.pop()(createFailMockFn(), errorUuid);
      });
    };

    describe("when using the native Promise library,", () => {
      testBattery(nativePromiseCallSet.map(el => testFn(el)));
    });
    describe('when using bluebird (a custom Promise/A+ library)', () => {
      testBattery(nativePromiseCallSet.map(el => testFn(el, bluebird)));
    });
    describe('when using nativePromiseOnly (a custom Promise/A+ library)', () => {
      testBattery(nativePromiseCallSet.map(el => testFn(el, nativePromiseOnly)));
    });
  });
});
