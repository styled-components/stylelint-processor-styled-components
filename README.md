# `stylelint-processor-styled-components`

Lint your [styled components](https://github.com/styled-components/styled-components) with [stylelint](http://stylelint.io/)!

[![Build Status][build-badge]][build-url]
[![Coverage Status][coverage-badge]][coverage-url]
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/styled-components/stylelint-processor)
[![Greenkeeper][greenkeeper-badge]][greenkeeper-url]

![Video of project in use](http://imgur.com/br9zdHb.gif)

## Setup

You need:

- `stylelint` (duh)
- This processor, to extract styles from `styled-components`
- The [`stylelint-config-styled-components`](https://github.com/styled-components/stylelint-config-styled-components) config to disable stylelint rules that clash with `styled-components`
- Your favorite `stylelint` config! (for example [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard))

```
(npm install --save-dev
  stylelint
  stylelint-processor-styled-components
  stylelint-config-styled-components
  stylelint-config-standard)
```

Now use those in your `.stylelintrc` and run stylelint with your JavaScript files!

```json
{
  "processors": ["stylelint-processor-styled-components"],
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-styled-components"
  ],
  "syntax": "scss"
}
```

> **NOTE:** The processor works with Flow- and TypeScript-typed files too! (we'll assume TypeScript usage if you're files end in `.ts` or `.tsx`)

## [Documentation](https://www.styled-components.com/docs/tooling#stylelint)

**Further documentation for this processor lives on [the styled-components website](https://www.styled-components.com/docs/tooling#stylelint)!**

- [Setup](https://www.styled-components.com/docs/tooling#setup)
- [Webpack](https://www.styled-components.com/docs/tooling#webpack)
- [Interpolation tagging](https://www.styled-components.com/docs/tooling#interpolation-taggingp)
- [Tags](https://www.styled-components.com/docs/tooling#tags)
- [sc-custom](https://www.styled-components.com/docs/tooling#sc-custom)
- [Syntax Notes](https://www.styled-components.com/docs/tooling#syntax-notes)


### Usage with other libraries

Some other libraries also implement the `styled.x` pattern with tagged template literals. This processor will lint the CSS in those tagged template literals too.

By default this module only works for variables imported from the the module name `styled-components` such as `import default, { some, variables } from 'styled-components'`, but if you want to use our module with a different library with a similar API you can simply change the `LETS_CHOOSE_A_GOOD_NAME` option and `stylelint-processor-styled-components` will lint your css from that library (note that we only have official support for `styled-components` though, but we hope others can also have benefit from this module). You would also need this option if you for some reason imported `styled-components` from a different path like `import styled from './node_modules/styled-components'` or something similar.

```js
import cool from 'other-library';

const Button = cool.button`
  color: blue;
`
```

```json
{
  "processors": [["stylelint-processor-styled-components", {
      "importName": "other-library"
  }]]
}
```

> **NOTE:** That double array is on purpose but only necessary if you set options, see the [processors configuration docs](https://stylelint.io/user-guide/configuration/#processors).

## License

Licensed under the MIT License, Copyright © 2017 Maximilian Stoiber. See [LICENSE.md](./LICENSE.md) for more information!

Based on Mapbox' excellent [`stylelint-processor-markdown`](https://github.com/mapbox/stylelint-processor-markdown), thanks to @davidtheclark!

[build-badge]: https://travis-ci.org/styled-components/stylelint-processor-styled-components.svg?branch=master
[build-url]: https://travis-ci.org/styled-components/stylelint-processor-styled-components
[coverage-badge]: https://coveralls.io/repos/github/styled-components/stylelint-processor-styled-components/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/styled-components/stylelint-processor-styled-components?branch=master
[greenkeeper-badge]: https://badges.greenkeeper.io/styled-components/stylelint-processor-styled-components.svg
[greenkeeper-url]: https://greenkeeper.io/
