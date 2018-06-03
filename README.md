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
