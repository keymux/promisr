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

    const promiseLibs = [Promise, bluebird, nativePromiseOnly, RSVP];

    const resolutionValidation = (expected, args) => actual => {
      expect(actual).to.deep.equal(expected);

      expect(fnSpy.calledOnce).to.be.true;

      const actuallyExpected = fnSpy.args[0].slice(0, fnSpy.args[0].length - 1);

      expect([actuallyExpected]).to.deep.equal([args]);
    };

    const rejectionValidation = (expected, args) => actual =>
      expect(actual).to.deep.equal(expected);

    const testFnCreator = secondaryTest => (
      numberOfArguments,
      promiseLibrary
    ) => (mockFn, expected) => {
      const args = new Array(numberOfArguments).map(() => uuid());

      const promisifyTest = promisify(mockFn, promiseLibrary);

      return promisifyTest(...args)
        .then(resolutionValidation(expected, args))
        .then(secondaryTest(promiseLibrary))
        .catch(rejectionValidation(expected, args));
    };

    const testFn = testFnCreator(
      promiseLibrarySpy => expect(promiseLibrarySpy.called).to.be.true
    );

    const testFnBasic = testFnCreator(() => {});

    promiseLibs.forEach((promiseLib, index) => {
      describe(`when using ${
        index < 1 ? "native Promises," : "Promise library " + index + ","
      }`, () => {
        it("should promise to execute a standard callback function with a 0 argument signature like (callback)", () => {
          return testFn(0, spy(promiseLib))(createPassMockFn(), passingUuid);
        });

        it("should promise to execute a standard callback function with a 1 argument signature like (a, callback)", () => {
          return testFn(1, spy(promiseLib))(createPassMockFn(), passingUuid);
        });

        it("should promise to execute a standard callback function with a 2 argument signature like (a, b, callback)", () => {
          return testFn(2, spy(promiseLib))(createPassMockFn(), passingUuid);
        });

        it("should promise to execute a standard callback function with a 10 argument signature like (a, b, c, d, e, f, g, h, i, j, callback)", () => {
          return testFn(10, spy(promiseLib))(createPassMockFn(), passingUuid);
        });

        it("should reject if called back with an error", () => {
          return testFn(10, spy(promiseLib))(createFailMockFn(), errorUuid);
        });
      });
    });

    const shouldNoPromiseLib = count =>
      `should promise to execute a standard callback function with a ${count} argument signature like (callback) without a provided promise library`;

    [0, 1, 2, 10].forEach(count =>
      it(shouldNoPromiseLib(count), () => {
        return testFnBasic(count)(createPassMockFn(), passingUuid);
      })
    );

    const shouldRejectNoPromiseLib = count =>
      `should promise to execute a standard callback function with a signature containing ${count} parameters without a provided promise library and reject if there there is an error in the result`;

    [0, 1, 2, 10].forEach(count =>
      it(shouldRejectNoPromiseLib(count), () =>
        testFnBasic(count)(createFailMockFn(), errorUuid)
      )
    );
  });
});
