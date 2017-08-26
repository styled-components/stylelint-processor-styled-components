# `stylelint-processor-styled-components`

Lint the CSS in your [styled components](https://github.com/styled-components/styled-components) with [stylelint](http://stylelint.io/)!

[![Build Status][build-badge]][build-url]
[![Coverage Status][coverage-badge]][coverage-url]
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/styled-components/stylelint-processor)
[![Greenkeeper][greenkeeper-badge]][greenkeeper-url]

![Video of project in use](http://imgur.com/br9zdHb.gif)

**NOTE**: This is currently in beta. We're getting close to being fully production ready, and have now covered most normal use cases. There are still some edge cases though, but we are working hard on getting them fixed for a v1.0 release in the near future. Please keep using it and submit bug reports!

## Usage

### Installation

You need:

- `stylelint` (duh)
- This processor (to add `styled-components` support)
- The [stylelint-config-styled-components-processor](https://github.com/styled-components/stylelint-config-styled-components-processor) shareable config
- The standard config for stylelint (or any config you like)

```
npm install --save-dev stylelint-processor-styled-components stylelint-config-styled-components-processor stylelint stylelint-config-standard
```

### Setup

Add a `.stylelintrc` file to the root of your project:

```JSON
{
  "processors": ["stylelint-processor-styled-components"],
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-styled-components-processor"
  ],
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

### Processor specific stylelint rules

When using this processor a couple of stylelint rules throw errors that you cannot prevent. Like
'[no-empty-source](https://stylelint.io/user-guide/rules/no-empty-source)' or
'[no-missing-end-of-source-newline](https://stylelint.io/user-guide/rules/no-missing-end-of-source-newline)'.

The [stylelint-config-styled-components-processor](https://github.com/styled-components/stylelint-config-styled-components-processor)
shareable config will automatically disable rules that cause unresolvable conflicts. Besides those
rules vendor prefixed [properties](https://stylelint.io/user-guide/rules/property-no-vendor-prefix)
and [values](https://stylelint.io/user-guide/rules/value-no-vendor-prefix) will throw an error since
styled-components automatically generates vendor prefixes for your css. Note that if you want to
change any of these rules you can always override them in your stylelint config.

### Webpack

For use with Webpack you can use the [`stylelint-custom-processor-loader`](https://github.com/emilgoldsmith/stylelint-custom-processor-loader).

### Syntax notes
#### Turning rules off from within your JS/CSS

Turning off rules with `stylelint-disable`-like comments (see the [stylelint documentation](https://stylelint.io/user-guide/configuration/#turning-rules-off-from-within-your-css) for all allowed syntax) is fully supported inside and outside of the tagged template literals, do note though that what actually happens behind the scene is that all `stylelint-(disable|enable)` comments are moved into the compiled css that is actually linted, so something like this:


```js
/* stylelint-disable */
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* stylelint-disable */
  background-color: red;
`;
```
or even
```js
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

We are afraid that we don't support linting interpolations (meaning the actual CSS that would be inserted into an interpolation through a variable or function during runtime) as it could be a big performance hit. You can of course lint your own mixins in their separate files, but it won't be linted in context, our implementation simply inserts relevant dummy values. This, we are afraid, means you won't be able to lint cases such as `declaration-block-no-duplicate-properties` etc. and won't be able to lint outside mixins such as [polished](https://github.com/styled-components/polished) in context.

#### Interpolation tagging
In order to handle a lot of edge cases in the above mentioned inserting of relevant dummy values in the interpolations we have made an API for you to be able to clearly tag what purpose your interpolation has with a comment. A quick example of something that would've caused a bug before that is now fixed is:
```js
const property = condition ? property1 : property2
const Button = styled.div`
  ${/* sc-prop */ property}: someValue;
`
```
as we wouldn't have been able to tell in all cases whether the interpolation was only a property or a whole declaration.

The API is defined as follows:
- `sc-` interpolation tags can only be placed before the first expression in the interpolation or after the last expression
- If no tag is found, our defaults work which guess whether the interpolation is just a value, multiple values or a whole declaration. This is error prone but should be able to handle most normal cases
- If a tag is found but the tag is invalid (doesn't follow the below specifications) an error will be thrown
- All tags are prefixed by `sc-` and the full list of possible tags is listed below. You may shorten the commands as much as you wish as long as it remains a unique shortening. If you are in doubt of the vocabulary you can refer to [this vocabulary list](http://apps.workflower.fi/vocabs/css/en) with examples. Here are the defined tags:
  - ref
  - block
  - selector
  - declaration
  - property
  - value
  - custom
- the custom tag is special as this is meant to handle the more unique and uncommon edge cases. When you use this tag, you can decide yourself what the placeholder will be by enclosing in quotes (either single or double) the placeholder such as this example: `/* sc-custom 'SOME PLACEHOLDER' */`

A few more real world examples for clarity and inspiration:
```js

const Button = styled.button`
  background: green;
  margin-${/* sc-custom 'left' */ props => ((props.theme.dir === 'rtl') ? 'left':'right')}: 12.5px;
`;

const Wrapper = styled.div`
  ${/* sc-sel */ Button} {
    color: red;
  }
`;
```

#### Template literal style and indentation

In order to have stylelint correctly apply indentation rules we need to do a bit of opinionated preprocessing on the `styled-components` styles, which results in us only officially supporting one coding style when it comes to `styled-components` tagged template literals. This style consists of always placing the closing backtick on the base level of indentation as follows:

**Right**
```js
const Button = styled.button`
  color: red;
`
```

```js
if (condition) {
  const Button = styled.button`
    color: red;
  `
}
```

**Wrong**
```js
if (condition) {
  const Button = styled.button`
    color: red;
`
}
```

```js
if (condition) {
  const Button = styled.button`
    color: red;`
}
```

It may be that other tagged template literal styles are coincidentally supported, but no issues will be handled regarding indentation unless the above style was used.

## License

Licensed under the MIT License, Copyright © 2016 Maximilian Stoiber. See [LICENSE.md](./LICENSE.md) for more information!

Based on Mapbox' excellent [`stylelint-processor-markdown`](https://github.com/mapbox/stylelint-processor-markdown), thanks to @davidtheclark!

[build-badge]: https://travis-ci.org/styled-components/stylelint-processor-styled-components.svg?branch=master
[build-url]: https://travis-ci.org/styled-components/stylelint-processor-styled-components
[coverage-badge]: https://coveralls.io/repos/github/styled-components/stylelint-processor-styled-components/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/styled-components/stylelint-processor-styled-components?branch=master
[greenkeeper-badge]: https://badges.greenkeeper.io/styled-components/stylelint-processor-styled-components.svg
[greenkeeper-url]: https://greenkeeper.io/
