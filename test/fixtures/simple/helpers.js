import { css, keyframes, injectGlobal } from 'styled-components'

// ⚠ Indentation
const styles = css`
color: blue;
`

// ⚠ Indentation
const animation = keyframes`
0% {
  opacity: 1;
}
100% {
  opacity: 0;
}
`

// ⚠ Indentation
injectGlobal`
html {
	margin: 0;
	padding: 0;
}
`
