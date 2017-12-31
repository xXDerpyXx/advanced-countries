# git-commit-count

[![Build Status](https://travis-ci.org/aichbauer/node-git-commit-count.svg?branch=master)](https://travis-ci.org/aichbauer/node-git-commit-count)
[![Build status](https://ci.appveyor.com/api/projects/status/ydlx1qy6a3tdypm3?svg=true)](https://ci.appveyor.com/project/rudolfsonjunior/node-git-commit-count-akb1b)
[![Coverage Status](https://coveralls.io/repos/github/aichbauer/node-git-commit-count/badge.svg?branch=master)](https://coveralls.io/github/aichbauer/node-git-commit-count?branch=master)

Checks how many commits a git repository has
## Installation

```sh
$ npm i git-commit-count --save
```
or
```sh
$ yarn add git-commit-count
```

## Usage

Returns the number of the amount of git commits. Returns `-1` if it is not a git repository.

```js
const commitCount = require('git-commit-count');

commitCount(); // number of process.cwd()
commitCount('any/git/repo'); // number
```

## LICENSE

MIT © Lukas Aichbauer
