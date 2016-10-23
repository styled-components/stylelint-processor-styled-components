import styled from 'styled-components'

// ⚠ 2 indentation errors ⚠
const Comp = () => {
  const Button = styled.button`
    color: blue;
      background: red;
  display: block;
  `

  return Button
}

// ⚠ 2 indentation errors ⚠
const Comp2 = () => {
  const InnerComp = () => {
    const Button = styled.button`
      color: blue;
        background: red;
    display: block;
    `

    return Button
  }

  return InnerComp()
}
