import styled from 'styled-components'

// Normal styled component
const Button = styled.button`
  color: blue;
`

// Tagname notation
const Button2 = styled('button')`
  color: red;
`

// Component Notation
const Button3 = styled(Button2)`
  color: violet;
`
