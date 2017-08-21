import styled from 'styled-components';

// Test block
const Button1 = styled.button`
  color: red;
  ${/* scp-block */ 'dummy'}
`;

// Test ref
const Button2 = styled.button`
  color: red;
  ${/* scp-ref */ Button1} {
    background-color: blue;
  }
`;

// Test selector
const Button3 = styled.button`
  color: red;
  ${/* scp-selector */ ':hover'} {
    background-color: blue;
  }
`;

// Test declaration
const Button4 = styled.button`
  color: red;
  ${/* scp-declaration */ 'dummy'}
`;

// Test property
const Button5 = styled.button`
  color: red;
  ${/* scp-property */ 'background-color'}: blue;
`;

// Test value
const Button6 = styled.button`
  color: red;
  background-color: ${/* scp-value */ 'blue'};
`;

// Test custom
const bool = true;
const Button7 = styled.button`
  color: red;
  margin-${/* scp-custom left */ bool ? 'left' : 'right'}: 10px;
`;
