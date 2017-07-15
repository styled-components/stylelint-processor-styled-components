# `stylelint-processor-styled-components`

Lint the CSS in your [styled components](https://github.com/styled-components/styled-components) with [stylelint](http://stylelint.io/)!

[![Build Status][build-badge]][build-url]
[![Coverage Status][coverage-badge]][coverage-url]
[![Greenkeeper][greenkeeper-badge]][greenkeeper-url]

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
  "extends": "stylelint-config-standard",
  "syntax": "scss"
}
```

> Setting the `syntax` to `scss` is needed for nesting and interpolation support!

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

### Syntax notes
#### Turning rules off from within your CSS
Turning off rules with `stylelint-disable`-like comments (see the [stylelint documentation](https://stylelint.io/user-guide/configuration/#turning-rules-off-from-within-your-css) for all allowed syntax) is fully supported inside and outside of the tagged template literals, do note though that what actually happens behind the scene is that all `stylelint-(disable|enable)` comments are moved into the compiled css that is actually linted, so something like this:


```
/* stylelint-disable */
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* stylelint-disable */
  background-color: red;
`;
```
or even
```
/* stylelint-disable */
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* stylelint-disable-next-line */
  background-color: red;
`;
```

would throw a stylelint error similar to `All rules have already been disabled (CssSyntaxError)`.

#### Interpolation linting
We do not currently support linting interpolations as it could be a big performance hit though we aspire to have at least partial support in the future. You can of course lint your own mixins in their separate files, but it won't be linted in context, the implementation currently just inserts relevant dummy values. This, we are afraid, means you won't be able to lint cases such as `declaration-block-no-duplicate-properties` etc. and won't be able to lint outside mixins such as [polished](https://github.com/styled-components/polished).

## License

Licensed under the MIT License, Copyright © 2016 Maximilian Stoiber. See [LICENSE.md](./LICENSE.md) for more information!

Based on Mapbox' excellent [`stylelint-processor-markdown`](https://github.com/mapbox/stylelint-processor-markdown), thanks to @davidtheclark!

[build-badge]: https://travis-ci.org/styled-components/stylelint-processor-styled-components.svg?branch=master
[build-url]: https://travis-ci.org/styled-components/stylelint-processor-styled-components
[coverage-badge]: https://coveralls.io/repos/github/styled-components/stylelint-processor-styled-components/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/styled-components/stylelint-processor-styled-components?branch=master
[greenkeeper-badge]: https://badges.greenkeeper.io/styled-components/stylelint-processor-styled-components.svg
[greenkeeper-url]: https://greenkeeper.io/
