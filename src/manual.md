# User manual 

Both the parser and the website are written in typescript, and so will require NPM. The website also makes use of React, which requires NPM version >5.2

The parser is not meant to be run directly, but is instead a package that is used within the website. Nonetheless, it is possible to create a typescript file with some code in TML so that the parse can parse it. It might be a good idea to have a look at the tests to see how this can be done!

The parser can be compiled from typescript to javascript (for publication to NPM) using `npm run compile`.

The website can be built using `npm run build`. This build can be viewed by the command `npx serve -s build` (`npx` not `npm`). 

To view the website, it might be easier to directly run `npm start`, but both options will work!
