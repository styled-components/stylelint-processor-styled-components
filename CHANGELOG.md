### 1.0.0
* added support for interpolation tagging to take care of all interpolation edge cases
* added moduleName option for better support for alternative libraries using a similar API
* moved documentation to https://styled-components.com/docs/tooling#stylelint

### 0.4.0
* move typescript to devDependencies
* upgrade typescript-eslint-parser to 7.0.0
* support .extend and .attrs Styled Components attributes
* added shared stylelint config to configure a couple of rules to fit with styled-components’ style of writing CSS

### 0.3.0
* fix interpolation following a comment edge case
* rewrote our indentation handling fixing a lot of indentation rule problems

### 0.2.2
* upgrade typescript-eslint-parser to 5.0.0

### 0.2.1
* fix edge case in interpolations inside a declaration block

### 0.2.0
* parse consecutive template literals for a single property
* upgrade devDependencies
* add interpolation linting section to README
* make styled-mixin interpolation substitutes unique
* added support for multiple interpolations in a property
* handles interpolations in one-line css
* support using stylelint-disable outside of tagged template literals
* upgrade stylelint to 8.0.0
* upgrade typescript-eslint-parser to 4.0.0

### 0.1.2
* fix: move typescript from dependencies to devdependencies

### 0.1.1
* add typescript support
* add newline between components' styles
* use unique name for each wrapped selector
* fix: set stylelint result `errored` to `false` if `warning` does not contain errors

### 0.1.0

* initial release

### 0.0.1 - 0.0.4

* working draft
