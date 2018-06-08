# Promisr

Promisr provides a collection of utilities for expanding promise functionality.

## Compatibility

| Node Version | Build status |
| ------------ | ------------ |
| v6.10.2      | TBD          |

## Install

```bash
npm install @keymux/promisr
```

```bash
yarn add @keymux/promisr
```

## Features

### promisify

Promisify returns a function which returns a promise to execute a callback-based function and provides the error in a rejection or the result in a resolution.

Promisify assumes the callback function definition is:

```js
function (error, result)
```

#### Example

```js
const fs = require("fs");
const path = require("path");

const { promisify } = require("@keymux/promisr");

const fileToRead = path.resolve("path/to/file");
const fsOptions = {};

// If you're having trouble understanding this function call,
// I recommend reading up on currying.
const readFilePromise =
  promisify(fs.readFile)(fileToRead, fsOptions)
  .then(fileContents => {
    console.log(fileContents);
  }).catch(fsError => {
    console.error(fsError);
  });
```

### promisifyCreator

`promisifyCreator` creates a custom promisify for alternative callback function definitions. `promisifyCreator` still assumes the callback is the last argument in the list.

#### Example

```js
const doStuff = (arg, cb) =>
  const error = undefined;
  const exitCode = 0;
  const result = "some result";

  cb(error, exitCode, result);
};

const doStuffPromise = promisifyCreator((resolve, reject) => (error, exitCode, result) => {
  if (error) reject(error);
  resolve(result);
});
```
