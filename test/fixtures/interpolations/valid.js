import styled from 'styled-components'

const color = 'red'

// Normal styled component
const Button = styled.button`
  display: block;
  color: ${color};
  background: blue;
`

const Box = styled.div`
  display: block;
  color: ${color};
  background: blue;
`

// Tagname notation
const Button2 = styled('button')`
  display: block;
  color: ${color};
  background: blue;
`

const Box2 = styled('div')`
  display: block;
  color: ${color};
  background: blue;
`

// Component Notation
const Button3 = styled(Button2)`
  display: block;
  color: ${color};
  background: blue;
`

const Box3 = styled(Box2)`
  display: block;
  color: ${color};
  background: blue;
`

// Multiline
const Button4 = styled.button`
  display: block;
  ${`
    color: blue;
  `}
  background: blue;
`

// Conditional 
const cond = true
const Button5 = styled.button`
  display: block;
  ${cond && `
    color: blue;
  `}
  background: blue;
`

// Conditional 
const cond2 = false 
const Button6 = styled.button`
  display: block;
  ${cond2 && `
    color: ${cond2};
  `}
  background: blue;
`
