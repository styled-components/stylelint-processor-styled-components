import styled, { css } from 'styled-components';

const interpolatedStyle = css`
  background-color: gray;
  color: gray;
`;

// Interpolation of chunk
const Div = styled.div`
  ${interpolatedStyle}
`;

// Conditional interpolation of chunk
const Button = styled.button`
  ${props => props.isHovering && interpolatedStyle}
`;

// Consecutive template literals
const gap = '5px';
const Span = styled.span`
  padding: 0 ${gap} ${gap};
`;
