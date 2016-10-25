# `stylelint-processor-styled-components`

Lint the CSS in your [styled components](https://github.com/styled-components/styled-components) with [stylelint](http://stylelint.io/)!

[![Build Status](https://travis-ci.org/styled-components/stylelint-processor-styled-components.svg?branch=master)](https://travis-ci.org/styled-components/stylelint-processor-styled-components) [![Coverage Status](https://coveralls.io/repos/github/styled-components/stylelint-processor-styled-components/badge.svg?branch=ci)](https://coveralls.io/github/styled-components/stylelint-processor-styled-components?branch=ci)

![Video of project in use](http://imgur.com/br9zdHb.gif)

**NOTE**: This is currently in alpha. While unit-tested, it doesn't yet have a lot of real world project exposure, so there'll be some edge cases we haven't covered. Please try it out and submit bug reports!

## Usage

### Installation

You need:

- `stylelint` (duh)
- This processor (to add `styled-components` support)
- The standard config for stylelint (or any config you like)

```
npm install --save-dev stylelint-processor-styled-components stylelint stylelint-config-standard
```

### Setup

Add a `.stylelintrc` file to the root of your project:

```JSON
{
  "processors": ["stylelint-processor-styled-components"],
  "extends": "stylelint-config-standard"
}
```

Then you need to actually run `stylelint`.

Add a `lint:css` script to your `package.json`. This script will run `stylelint` with a path to all of your files containing `styled-components` code:

```JSON
{
  "scripts": {
    "lint:css": "stylelint './components/**/*.js'"
  }
}
```

> **NOTE:** Don't worry about passing in files that don't contain any styled-components code – we take care of that.

Now you can lint your CSS by running this script! 🎉

```
npm run lint:css
```

## License

Licensed under the MIT License, Copyright © 2016 Maximilian Stoiber. See [LICENSE.md](./LICENSE.md) for more information!

Based on Mapbox' excellent [`stylelint-processor-markdown`](https://github.com/mapbox/stylelint-processor-markdown), thanks to @davidtheclark!
