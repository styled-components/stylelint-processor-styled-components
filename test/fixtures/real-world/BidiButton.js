import React from 'react'
import styled, { ThemeProvider } from 'styled-components'

const BidiButton = () => {
  const bidi = styled.button`
    background: green;
    margin-${props => ((props.theme.dir === 'rtl') ? 'left':'right')}: 12.5px;
  `;
};

export default (props) => {
  return (
    <ThemeProvider theme={{ dir: 'rtl' }}>
      <BidiButton />
    </ThemeProvider>
  );
};
