const promisify = fn => (...promisifyArgs) =>
  new Promise((resolve, reject) => {
    promisifyArgs.push((error, result) => {
      if (error) reject(error);
      resolve(result);
    });

    fn(...promisifyArgs);
  });

module.exports = {
  promisify,
};
