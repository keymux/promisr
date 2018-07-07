const zip = keys => vals =>
  keys.reduce((acc, key, i) => Object.assign(acc, { [key]: vals[i] }), {});

module.exports = {
  zip,
};
