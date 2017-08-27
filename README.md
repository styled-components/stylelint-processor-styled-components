# `stylelint-processor-styled-components`

Lint your [styled components](https://github.com/styled-components/styled-components) with [stylelint](http://stylelint.io/)!

[![Build Status][build-badge]][build-url]
[![Coverage Status][coverage-badge]][coverage-url]
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/styled-components/stylelint-processor)
[![Greenkeeper][greenkeeper-badge]][greenkeeper-url]

![Video of project in use](http://imgur.com/br9zdHb.gif)

## Usage

### Installation

You need:

- `stylelint` (duh)
- This processor, to extract styles from `styled-components`
- The [`stylelint-config-styled-components-processor`](https://github.com/styled-components/stylelint-config-styled-components-processor) to disable stylelint rules that clash with `styled-components`
- Your favorite `stylelint` config! (for example [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard))

```
(npm install --save-dev
  stylelint
  stylelint-processor-styled-components
  stylelint-config-styled-components-processor
  stylelint-config-standard)
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

> **NOTE:** Setting the `syntax` to `scss` is needed for nesting and interpolation support!

Then you need to run `stylelint`. Add a `lint:css` script to your `package.json` which runs `stylelint` with a glob to all of your styled components:

```JSON
{
  "scripts": {
    "lint:css": "stylelint './src/**/*.js'"
  }
}
```

> **NOTE:** The processor ignores javascript files that don't contain any `styled-components`, so don't worry about being too broad as long as you restrict it to javascript (or TypeScript).

Now you can lint your CSS by running the script! 🎉

```
npm run lint:css
```

#### Webpack

If you want to lint on build, rather than as a separate command, you can use the [`stylelint-custom-processor-loader`](https://github.com/emilgoldsmith/stylelint-custom-processor-loader) for webpack.

### Processor specific stylelint rules

When using this processor a couple of stylelint rules throw errors that cannot be prevented, like [`no-empty-source`](https://stylelint.io/user-guide/rules/no-empty-source) or [`no-missing-end-of-source-newline`](https://stylelint.io/user-guide/rules/no-missing-end-of-source-newline). There's also a couple rules which we need to enforce, like [`no-vendor-prefix` rules](https://stylelint.io/user-guide/rules/property-no-vendor-prefix). (`styled-components` automatically vendor prefixes your code, so you don't need to do it manually)

The [`stylelint-config-styled-components-processor`](https://github.com/styled-components/stylelint-config-styled-components-processor) will automatically disable rules that cause conflicts.

> **NOTE:** You can override rules defined in shared configs in your custom `.stylelintrc`.

### Interpolation tagging

Sometimes `stylelint` can throw an error (e.g. `CssSyntaxError`) even though nothing is wrong with your CSS. This is often due to an interpolation, more specifically the fact that the processor doesn't know what you're interpolating.

A simplified example:

```js
const something = 'background';

const Button = styled.div`
  ${something}: papayawhip;
`
```

When you have interpolations in your styles the processor can't know what they are, so it makes a good guess and replaces them with a syntactically equivalent placeholder value. Since `stylelint` is not a code flow analysis tool this doesn't cover all edge cases and the processor will get it wrong every now and then.

Interpolation tagging allows you to tell the processor what an interpolation is in case it guesses wrong; it can then replace the interpolation with a syntactically correct value based on your tag.

For example:

```js
const something = 'background';

const Button = styled.div`
  // Tell the processor that "something" is a property
  ${/* sc-prop */ something}: papayawhip;
`
```

Now the processor knows that the `something` interpolation is a property, and it can replace the interpolation with a property for linting.

To tag an interpolation add a comment at either the start or the end of the interpolation. (`${/* sc-tag */ foo}` or `${bar /* sc-tag */}`) Tags start with `sc-` and, if specified, a tag overrides the processors guess about what the interpolation is.

#### Tags

The full list of supported tags:

- `sc-ref`
- `sc-block`
- `sc-selector`
- `sc-declaration`
- `sc-property`
- `sc-value`

> **NOTE:** If you are in doubt of the vocabulary you can refer to [this CSS vocabulary list](http://apps.workflower.fi/vocabs/css/en) with examples.

For example, when you interpolate another styled component, what you really interpolate is its unique selector. Since the processor doesn't know that, you can tell it to replace it with a selector when linting:

```js
const Wrapper = styled.div`
  ${/* sc-selector */ Button} {
    color: red;
  }
`;
```

You can also use shorthand tags to avoid cluttering the code. For example:

```js
const Wrapper = styled.div`
  ${/* sc-sel */ Button} {
    color: red;
  }
`;
```

##### `sc-custom`

**`sc-custom` is meant to be used as a last resort escape hatch. Prefer to use the standard tags if possible!**

On top of the above standard tags the processor also has the `sc-custom` tag to allow you to cover more unique and uncommon edge cases. With the `sc-custom` tag you can decide yourself what the placeholder value will be.

For example:

```js
// Switch between left and right based on language settings passed through via the theme
const rtlSwitch = props => props.theme.dir === 'rtl' ? 'left' : 'right';

const Button = styled.button`
  background: green;
  // Tell the processor to replace the interpolation with "left"
  // when linting
  margin-${/* sc-custom 'left' */ rtlSwitch}: 12.5px;
`;
```

### Syntax notes

#### Turning rules off from within your JS/CSS

Turn off rules with `stylelint-disable` comments (see the [stylelint documentation](https://stylelint.io/user-guide/configuration/#turning-rules-off-from-within-your-css) for all allowed syntax) both inside and outside of the tagged template literals.

```js
import React from 'react';
import styled from 'styled-components';

// Disable stylelint from within the tagged template literal
const Wrapper = styled.div`
  /* stylelint-disable */
  background-color: 123;
`;

// Or from the JavaScript around the tagged template literal
/* stylelint-disable */
const Wrapper = styled.div`
  background-color: 123;
`;
```

#### Template literal style and indentation

In order to have stylelint correctly apply indentation rules the processor needs to do a bit of opinionated preprocessing on the styles, which results in us only officially supporting one indentation style. (the supported style is the "default" one as shown in all the documentation)

The important thing is that you put the closing backtick on the base level of indentation as follows:

**Right**

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

Licensed under the MIT License, Copyright © 2017 Maximilian Stoiber. See [LICENSE.md](./LICENSE.md) for more information!

Based on Mapbox' excellent [`stylelint-processor-markdown`](https://github.com/mapbox/stylelint-processor-markdown), thanks to @davidtheclark!

[build-badge]: https://travis-ci.org/styled-components/stylelint-processor-styled-components.svg?branch=master
[build-url]: https://travis-ci.org/styled-components/stylelint-processor-styled-components
[coverage-badge]: https://coveralls.io/repos/github/styled-components/stylelint-processor-styled-components/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/styled-components/stylelint-processor-styled-components?branch=master
[greenkeeper-badge]: https://badges.greenkeeper.io/styled-components/stylelint-processor-styled-components.svg
[greenkeeper-url]: https://greenkeeper.io/
