# Readme

This folder contains all the content created during the project. The entire directory is available to be cloned from [github](https://github.com/pete-g00/Turing-Machine-Language).

The directory structure is:

* `language` - the language definition with equivalence proof to TMs.
* `tml-parser` - the code for the parser.
* `website` - the code for the product.

## Build instructions

### Requirements

The project makes use of the node package manager (NPM). 

Typescript should be automatically installed this way, but if that doesn't work, [follow the instructions here](https://www.typescriptlang.org/download).

The website makes use of the React framework. This requires NPM version to be at least 5.2.

This should be sufficient to run the code (at least in windows 10/11).

### Build steps

Within the parser/website directory, the required packages can be installed by `npm install`. 

The website can be viewed locally using `npm start`. It is possible to view the latest version of the website online as well [here](https://pete-g00.github.io/Turing-Machine-Language/).

### Test steps

Within the parser/website directory, the tests can be run using `npm run test`.
