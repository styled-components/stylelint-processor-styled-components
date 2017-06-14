import styled, { keyframes } from 'styled-components'

// None of the below should throw indentation errors
const Comp = () => {
  const Button = styled.button`
    color: blue;
  `

  return Button
}

const Comp2 = () => {
  const InnerComp = () => {
    const Button = styled.button`
      color: blue;
    `

    return Button
  }

  return InnerComp()
}

const Button = styled.button`color: blue;`

const animations = {
  spinnerCircle: keyframes`
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  `
}
