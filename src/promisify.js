const promisify = (fn, promiseLibrary = Promise) => (...promisifyArgs) => {
  return new promiseLibrary((resolve, reject) => {
    promisifyArgs.push((error, result) => {
      if (error) reject(error);
      resolve(result);
    });

    fn(...promisifyArgs);
  });
};

module.exports = {
  promisify,
};
