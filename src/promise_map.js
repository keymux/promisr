const { zip } = require("./lib/zip");

const promiseMap = map => {
  keys = Object.keys(map);

  return Promise.all(keys.map(k => map[k])).then(zip(keys));
};

module.exports = {
  promiseMap,
};
