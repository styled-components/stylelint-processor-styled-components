import styled, { css } from 'styled-components';
import React from 'react'

export default props => {
  const CirclePrimitive = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    ${props.rotate && css`
      -webkit-transform: rotate(${props.rotate}deg);
      -ms-transform: rotate(${props.rotate}deg);
      // next line has wrong property
      transformm: rotate(${props.rotate}deg);
    `}

    &:before {
      content: '';
      display: block;
      margin: 0 auto;
      width: 15%;
      height: 15%;
      background-color: #333;
      border-radius: 100%;
      animation: ${animations.spinnerCircle} 1.2s infinite ease-in-out both;
      ${props.delay && css`
        -webkit-animation-delay: ${props.delay}s;
        // next line has wrong property
        animation-delayy: ${props.delay}s;
      `}
    }
  `
  return React.createElement(CirclePrimitive)
}
