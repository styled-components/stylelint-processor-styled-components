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
- The [`stylelint-config-styled-components`](https://github.com/styled-components/stylelint-config-styled-components) config to disable stylelint rules that clash with `styled-components`
- Your favorite `stylelint` config! (for example [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard))

```
(npm install --save-dev
  stylelint
  stylelint-processor-styled-components
  stylelint-config-styled-components
  stylelint-config-standard)
```

## [Documentation](https://www.styled-components.com/docs/tooling#stylelint)

**The documentation for this plugin lives on [the styled-components website](https://www.styled-components.com/docs/tooling#stylelint)!**

- [Setup](https://www.styled-components.com/docs/tooling#setup)
- [Webpack](https://www.styled-components.com/docs/tooling#webpack)


## License

Licensed under the MIT License, Copyright © 2017 Maximilian Stoiber. See [LICENSE.md](./LICENSE.md) for more information!

Based on Mapbox' excellent [`stylelint-processor-markdown`](https://github.com/mapbox/stylelint-processor-markdown), thanks to @davidtheclark!

[build-badge]: https://travis-ci.org/styled-components/stylelint-processor-styled-components.svg?branch=master
[build-url]: https://travis-ci.org/styled-components/stylelint-processor-styled-components
[coverage-badge]: https://coveralls.io/repos/github/styled-components/stylelint-processor-styled-components/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/styled-components/stylelint-processor-styled-components?branch=master
[greenkeeper-badge]: https://badges.greenkeeper.io/styled-components/stylelint-processor-styled-components.svg
[greenkeeper-url]: https://greenkeeper.io/
