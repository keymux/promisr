const promisifyCreator = callbackCreator => (fn, promiseLibrary = Promise) => (
  ...promisifyArgs
) =>
  new promiseLibrary((resolve, reject) => {
    promisifyArgs.push(callbackCreator(resolve, reject));

    fn(...promisifyArgs);
  });

const defaultCallbackCreator = (resolve, reject) => (error, result) => {
  if (error) reject(error);
  resolve(result);
};

const promisify = promisifyCreator(defaultCallbackCreator);

module.exports = {
  promisify,
  promisifyCreator,
};
